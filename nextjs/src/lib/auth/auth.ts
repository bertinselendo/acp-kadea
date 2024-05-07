import NextAuth from "next-auth";
// import Nodemailer from "next-auth/providers/nodemailer";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { sendEmail } from "../mail/sendEmail";
import { toast } from "sonner";
import MagicLinkMail from "../../../emails/magicLinkEmail";
import { prisma } from "../prisma";

export const {
  handlers: { GET, POST },
  auth: baseAuth,
} = NextAuth({
  pages: {
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    signIn: "/login",
    signOut: "/logout",
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // Nodemailer({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    Resend({
      apiKey: process.env.RESEND_KEY,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const result = await sendEmail({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Access your account in one click`,
          react: MagicLinkMail({
            url,
          }),
        });

        if (result.error) {
          toast.error("Auth Resend Provider Error", {
            description: "contact administrator",
          });
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
  trustHost: true,
});
