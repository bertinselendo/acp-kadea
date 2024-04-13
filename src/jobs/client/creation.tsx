"use server";

import { notificationRef } from "@/components/notifications/notifications-ref";
import { notificationType } from "@/components/notifications/notifications-types";
import { resend } from "@/lib/resend-trigger";
import { client } from "@/trigger";
import ActivityLinkMail from "@email/activityButtonMail";

import { eventTrigger } from "@trigger.dev/sdk";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";

client.defineJob({
  id: "client-creation-notification",
  name: "Client Creation Notification",
  version: "0.1.0",
  trigger: eventTrigger({
    name: "send.client-creation-notification",
    schema: z.object({
      userEmail: z.union([z.string(), z.array(z.string())]),
      senderEmail: z.string(),
      senderName: z.string(),
      heading: z.string(),
      body: z.string(),
      footer: z.string(),
      link: z.string(),
    }),
  }),
  integrations: {
    resend,
  },
  run: async (payload, io, ctx) => {
    await io.wait("wait 20 sec", 20);

    await io.resend.emails.send("send-email", {
      to: payload.userEmail,
      subject: payload.heading,
      react: (
        <ActivityLinkMail
          heading={payload.heading}
          body={payload.body}
          link={payload.link}
          footer={payload.footer}
        />
      ),
      from: `ACP <${process.env.EMAIL_FROM}>`,
    });

    await io.logger.info("Received the scheduled event", {
      payload,
    });
    return payload;
  },
});

export const sendClientCreationNotification = ({
  userEmail,
  senderEmail,
  senderName,
  reference,
  link,
}: notificationType) => {
  const heading = `${reference} Account Creation`;
  const body = `We are pleased to inform you that an account has been created for ${reference} by ${senderName}. This email serves as confirmation of the successful creation of your account. To access your account, please click the button below:`;
  const footer =
    "If you have any questions or need assistance, please do not hesitate to contact us.";

  userEmail.map((email) => {
    addDoc(notificationRef, {
      date: serverTimestamp(),
      userEmail: email,
      senderEmail: senderEmail,
      senderName: senderName,
      type: "client-creation",
      reference: reference,
      text: body,
      link: link,
      isRead: false,
    });
  });

  client.sendEvent({
    name: "send.client-creation-notification",
    payload: {
      userEmail: userEmail,
      senderEmail: senderEmail,
      senderName: senderName,
      heading: heading,
      body: body,
      footer: footer,
      link: link,
    },
  });
};
