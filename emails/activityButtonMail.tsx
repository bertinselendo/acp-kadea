import {
  Button,
  Heading,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

type ActivityLinkMailType = {
  heading: string;
  body: string;
  footer: string;
  link: string;
};

export default function ActivityLinkMail({
  heading,
  body,
  footer,
  link,
}: ActivityLinkMailType) {
  return (
    <EmailLayout>
      {/* <Preview>{heading}</Preview> */}
      <Section>
        <Heading className="text-3xl font-bold my-7">{heading}</Heading>
        <Text className="text-lg mb-7">Hello,</Text>
        <Text className="text-lg mb-7">{body}</Text>

        <Button
          href={link}
          className="w-[90%] p-4 rounded-lg text-center font-semibold bg-[#2eb67d] text-white"
        >
          Click here to view
        </Button>

        <Text>{footer}</Text>
      </Section>
    </EmailLayout>
  );
}
