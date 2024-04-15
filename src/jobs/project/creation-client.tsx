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
  id: "project-creation-client-notification",
  name: "Project Creation Client Notification",
  version: "0.1.0",
  trigger: eventTrigger({
    name: "send.project-creation-client-notification",
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

    console.log(payload);

    await io.resend.emails.send("send.project-creation-client-notification", {
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

export const sendProjectCreationClientNotification = async ({
  userEmail,
  senderEmail,
  senderName,
  reference,
  reference2,
  link,
}: notificationType & { reference2: string }) => {
  const heading = `Project ${reference} created`;
  const body = `We are excited to inform you that a new project ${reference} has been created for ${reference2}. You have been notified of the project creation.`;
  const footer = "Stay tuned for further updates on the project.";

  userEmail.map((email) => {
    addDoc(notificationRef, {
      date: serverTimestamp(),
      userEmail: email,
      senderEmail: senderEmail,
      senderName: senderName,
      type: "project-client-creation",
      reference: reference,
      text: `A new project ${reference} has been created for ${reference2}`,
      link: link,
      isRead: false,
    });
  });

  await client.sendEvent({
    name: "send.project-creation-client-notification",
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
