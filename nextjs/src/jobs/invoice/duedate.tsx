"use server";

import { resend } from "@/lib/resend-trigger";
import { client } from "@/trigger";
import { prisma } from "@/lib/prisma";
import ActivityLinkMail from "@email/activityButtonMail";

import { cronTrigger } from "@trigger.dev/sdk";
import dayjs from "dayjs";
import { getServerUrl } from "@/lib/server-url";

client.defineJob({
  id: "duedate-invoice-notification",
  name: "Due Date Invoice Notification",
  version: "0.1.0",
  trigger: cronTrigger({
    cron: "30 09 * * *",
  }),
  integrations: {
    resend,
  },
  run: async (payload, io, ctx) => {
    const footer = "For any questions, feel free to contact us.";

    const invoices = await prisma.invoice.findMany({
      include: {
        project: {
          include: {
            client: true,
          },
        },
      },
    });

    invoices.map(async (invoice) => {
      const duedate = dayjs(invoice.dueDate);
      const daydiff = duedate.diff(dayjs(), "days");
      if (daydiff === 3) {
        await io.runTask("3day-invoice-reminder", async () => {
          const heading = `Payment Reminder for Invoice ${invoice.reference} - ${invoice.project.title}`;
          await io.resend.emails.send("send-email", {
            to: invoice.project.client.companyEmail,
            subject: heading,
            react: (
              <ActivityLinkMail
                heading={heading}
                body={`We would like to remind you that your invoice reference ${invoice.reference} for the project ${invoice.project.title} will be due in 3 days upon receipt of this reminder. This is an automated email. You can simply ignore this if you have already made the payment. Thank you.`}
                link={`${getServerUrl()}/p/cluwpwkvc000lxu4jz0m60yne/invoices/view?url=${encodeURIComponent(
                  invoice.file
                )}`}
                footer={footer}
              />
            ),
            from: `ACP <${process.env.EMAIL_FROM}>`,
          });
        });
      }

      if (daydiff === 0) {
        await io.runTask("today-invoice-reminder", async () => {
          const heading = `Payment Reminder for Invoice ${invoice.reference} - ${invoice.project.title}`;
          await io.resend.emails.send("send-email", {
            to: invoice.project.client.companyEmail,
            subject: heading,
            react: (
              <ActivityLinkMail
                heading={heading}
                body={`We would like to remind you that your invoice reference ${invoice.reference} for the project ${invoice.project.title} is due today. This is an automated email. You can simply ignore this if you have already made the payment. Thank you.`}
                link={`${getServerUrl()}/p/cluwpwkvc000lxu4jz0m60yne/invoices/view?url=${encodeURIComponent(
                  invoice.file
                )}`}
                footer={footer}
              />
            ),
            from: `ACP <${process.env.EMAIL_FROM}>`,
          });
        });
      }
    });

    await io.logger.info("Received the scheduled event");
  },
});
