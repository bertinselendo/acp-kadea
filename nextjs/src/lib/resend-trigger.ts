import { env } from "process";
import { Resend } from "@trigger.dev/resend";

export const resend = new Resend({
  id: "resend",
  apiKey: env.RESEND_API_KEY!,
});
