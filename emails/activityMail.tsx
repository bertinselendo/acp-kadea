import {
  Button,
  Heading,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

type ActivityMailType = {
  heading: string;
  body: string;
  footer: string;
};

export default function ActivityMail({
  heading,
  body,
  footer,
}: ActivityMailType) {
  return (
    <EmailLayout>
      <Preview>{heading}</Preview>
      <Section>
        <Heading className="text-3xl font-bold my-7">{heading}</Heading>
        <Text className="text-lg mb-7">{body}</Text>

        <Text>{footer}</Text>
      </Section>
    </EmailLayout>
  );
}
