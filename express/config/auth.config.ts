import Resend from "@auth/express/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../lib/prisma";
import { sendEmail } from "../lib/mail/sendEmail";

export const authConfig = {
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_KEY,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const result = await sendEmail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Access your account in one click`,
          html: `<strong>Simply click on the link below to access your account</strong> ${url}`,
        });

        if (result.error) {
          throw new Error(`Failed to send email: ${result.error}`);
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user }) {
      return session;
    },
  },
};
