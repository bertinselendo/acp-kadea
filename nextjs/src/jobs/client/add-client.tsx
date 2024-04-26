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
  id: "client-add-notification",
  name: "Client Add Notification",
  version: "0.1.0",
  trigger: eventTrigger({
    name: "send.client-add-notification",
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

export const sendClientAddNotification = async ({
  userEmail,
  senderEmail,
  senderName,
  reference,
  link,
}: notificationType) => {
  const heading = `You were added to ${reference}`;
  const body = `You have been added to ${reference} by ${senderName}. Join us by clicking the link below to connect`;
  const footer =
    "We look forward to having you on our team and connecting with you!";

  userEmail.map((email) => {
    addDoc(notificationRef, {
      date: serverTimestamp(),
      userEmail: email,
      senderEmail: senderEmail,
      senderName: senderName,
      type: "client-add",
      reference: reference,
      text: `You have been added to ${reference} by ${senderName}`,
      link: link,
      isRead: false,
    });
  });

  await client.sendEvent({
    name: "send.client-add-notification",
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
