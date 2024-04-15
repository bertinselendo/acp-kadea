import { TriggerClient } from "@trigger.dev/sdk";

export const client = new TriggerClient({
  id: "agence-client-portal-qbx3",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});
