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
  id: "team-creation-notification",
  name: "Team Creation Notification",
  version: "0.1.0",
  trigger: eventTrigger({
    name: "send.team-creation-notification",
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

export const sendTeamCreationNotification = async ({
  userEmail,
  senderEmail,
  senderName,
  reference,
  link,
}: notificationType) => {
  const heading = `You have join our team`;
  const body =
    "You have been added to our resource management team. Join us by clicking the link below to connect";
  const footer =
    "We look forward to having you on our team and connecting with you!";

  userEmail.map((email) => {
    addDoc(notificationRef, {
      date: serverTimestamp(),
      userEmail: email,
      senderEmail: senderEmail,
      senderName: senderName,
      type: "team-creation",
      reference: reference,
      text: body,
      link: link,
      isRead: false,
    });
  });

  await client.sendEvent({
    name: "send.team-creation-notification",
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
