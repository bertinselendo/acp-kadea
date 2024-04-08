import { getServerUrl } from "@/lib/server-url";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Hr,
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
        {/* <Preview>Confirm your email address</Preview> */}
        <Body className="bg-white mx-auto">
          <Container className="mx-auto px-5">
            <Section className="mt-9">
              <Img
                src={`${baseUrl}/logo.png`}
                width="120"
                height="36"
                alt="Localhost"
              />
            </Section>

            <Hr className="border-gray-300" />

            {children}

            <Section>
              <Row className="mb-8 px-2 w-full">
                <Column style={{ width: "66%" }}>
                  <Img
                    src={`${baseUrl}/static/slack-logo.png`}
                    width="120"
                    height="36"
                    alt="Localhost"
                  />
                </Column>
                <Column>
                  <Section>
                    <Row>
                      <Column>
                        <Link href="/">
                          <Img
                            src={`${baseUrl}/logo/twitter.png`}
                            width="32"
                            height="32"
                            alt="Twitter"
                            style={socialMediaIcon}
                          />
                        </Link>
                      </Column>
                      <Column>
                        <Link href="/">
                          <Img
                            src={`${baseUrl}/logo/facebook.png`}
                            width="32"
                            height="32"
                            alt="Facebook"
                            style={socialMediaIcon}
                          />
                        </Link>
                      </Column>
                      <Column>
                        <Link href="/">
                          <Img
                            src={`${baseUrl}/logo/linkedin.png`}
                            width="32"
                            height="32"
                            alt="linkedin"
                            style={socialMediaIcon}
                          />
                        </Link>
                      </Column>
                    </Row>
                  </Section>
                </Column>
              </Row>
            </Section>

            <Section>
              <Link
                style={footerLink}
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </Link>
              &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
              <Link
                style={footerLink}
                href="http://localhost:3000/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Policies
              </Link>
              &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
              <Link
                style={footerLink}
                href="http://localhost:3000/help"
                target="_blank"
                rel="noopener noreferrer"
              >
                Help center
              </Link>
              &nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
              <Link
                style={footerLink}
                href="http://localhost:3000/term"
                target="_blank"
                rel="noopener noreferrer"
                data-auth="NotApplicable"
                data-linkindex="6"
              >
                Term
              </Link>
              <Text className="text-xs text-[#b7b7b7] mb-12">
                ©2024 Localhost Technologies, LLC, a Salesforce company. <br />
                500 Howard Street, San Francisco, CA 94105, USA <br />
                <br />
                All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

const footerLink = {
  color: "#b7b7b7",
};

const socialMediaIcon = {
  display: "inline",
  marginLeft: "32px",
};
