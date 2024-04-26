import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * This is the schema for the environment variables.
 *
 * Please import **this** file and use the `env` variable
 */
export const env = createEnv({
  server: {
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.number().min(1),
    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    PRODUCTION_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
  },
  /**
   * If you add `client` environment variables, you need to add them to
   * `experimental__runtimeEnv` as well.
   */
  client: {},
  experimental__runtimeEnv: {},
});
