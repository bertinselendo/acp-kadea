import {
  Button,
  Heading,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

export default function MagicLinkMail({ url }: { url: string }) {
  return (
    <EmailLayout>
      <Preview>
        You have requested a magic link to sign in to your account.
      </Preview>
      <Section>
        <Heading className="text-3xl font-bold my-7">
          Access your account in one click
        </Heading>
        <Text className="text-lg mb-7">
          Simply click on the link below to access your account - This link is
          unique and can only be used once.
        </Text>

        <Button
          href={url}
          className="w-[90%] p-4 rounded-lg text-center font-semibold bg-[#2eb67d] text-white"
        >
          Click here to sign in
        </Button>

        <Text>
          If you didn&apos;t request this email, there&apos;s nothing to worry
          about, you can safely ignore it.
        </Text>
      </Section>
    </EmailLayout>
  );
}
