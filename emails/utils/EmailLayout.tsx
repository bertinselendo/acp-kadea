import { getServerUrl } from "@/lib/server-url";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import type { PropsWithChildren } from "react";

export const EmailLayout = ({ children }: PropsWithChildren) => {
  const baseUrl = getServerUrl();
  return (
    <Tailwind
      config={
        {
          // Theme can go here
        }
      }
    >
      <Html>
        <Head />
        <Body className="bg-white font-sans">
          <Container className="mx-auto bg-contain bg-bottom bg-no-repeat p-6">
            <table cellPadding={0} cellSpacing={0}>
              <tr>
                <td className="pr-2">
                  <Img
                    src={`${baseUrl}`}
                    width={32}
                    height={32}
                    className="inline"
                    alt={`localhost's logo`}
                  />
                </td>
                <td>
                  <Text className="text-xl font-bold">Localhost</Text>
                </td>
              </tr>
            </table>
            {children}
            <Hr className="mt-12 border-gray-300" />
            <Img
              src={`${baseUrl}`}
              width={32}
              height={32}
              className="inline"
              alt={`localhost's logo`}
            />
            <Link href={`${baseUrl}/api/emails/unsubscribe`}>Unsubscribe</Link>
            <Text className="ml-1 text-sm text-gray-500">Localhost</Text>
            <Text className="ml-1 text-sm text-gray-500">france</Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
