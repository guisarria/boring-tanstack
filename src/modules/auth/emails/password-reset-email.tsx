import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

type PasswordResetData = {
  name: string
  url: string
  firstName?: string
  lastName?: string
}

function getInitials(
  firstName?: string,
  lastName?: string,
  name?: string,
): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) {
    return firstName[0].toUpperCase()
  }
  if (name) {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name[0].toUpperCase()
  }
  return ""
}

export default function PasswordResetEmail({
  name,
  url,
  firstName,
  lastName,
}: PasswordResetData) {
  const initials = getInitials(firstName, lastName, name)
  return (
    <Html>
      <Head />
      <Preview>
        {name ? `${name}, reset` : "Reset"} your password for Boring TanStack
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>Boring TanStack</Text>
          </Section>

          <Section style={heroSection}>
            <Section style={iconCircle}>
              <Text style={iconText}>{initials}</Text>
            </Section>

            <Heading as="h1" style={heading}>
              Reset your password
            </Heading>

            <Text style={greetingText}>{name ? `Hi, ${name}!` : "Hi!"}</Text>

            <Text style={paragraph}>
              We received a request to reset your password. Click the button
              below to choose a new password. If you didn&apos;t make this
              request, you can safely ignore this email.
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button href={url} style={button}>
              Reset my password
            </Button>
          </Section>

          <Section style={timerSection}>
            <Text style={timerText}>This link expires in 24 hours</Text>
          </Section>

          <Hr style={hr} />

          <Section style={fallbackSection}>
            <Text style={fallbackLabel}>
              Having trouble? Click the button or copy the link below:
            </Text>
            <Link href={url} style={linkBox}>
              {url}
            </Link>
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Text style={footer}>
              You received this email because a password reset was requested for
              your account. If this wasn&apos;t you, you can safely ignore this
              email.
            </Text>
            <Text style={footerBrand}>
              © {new Date().getFullYear()} Boring TanStack. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#F5F5F4",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  overflow: "hidden" as const,
  border: "1px solid #E5E5E5",
}

const logoSection = {
  padding: "28px 40px 24px",
  textAlign: "center" as const,
  borderBottom: "1px solid #F5F5F4",
}

const logoText = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#171717",
  letterSpacing: "0.5px",
  margin: "0",
}

const heroSection = {
  padding: "40px 40px 32px",
  textAlign: "center" as const,
}

const iconCircle = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "#F5F5F4",
  margin: "0 auto 24px",
  lineHeight: "80px",
  textAlign: "center" as const,
  border: "1px solid #E5E5E5",
}

const iconText = {
  fontSize: "28px",
  lineHeight: "74px",
  margin: "0",
  color: "#171717",
  fontWeight: "700",
}

const heading = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#171717",
  margin: "0 0 12px",
  letterSpacing: "-0.4px",
}

const greetingText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#525252",
  fontWeight: "600",
  margin: "0 0 20px",
}

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#525252",
  margin: "0",
}

const buttonSection = {
  padding: "20px 40px 16px",
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#171717",
  borderRadius: "8px",
  color: "#FFFFFF",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 40px",
  letterSpacing: "0.2px",
}

const timerSection = {
  padding: "0 0 36px",
  textAlign: "center" as const,
}

const timerText = {
  fontSize: "13px",
  color: "#737373",
  margin: "0",
  fontWeight: "500",
}

const hr = {
  borderColor: "#F5F5F4",
  margin: "0",
}

const fallbackSection = {
  padding: "20px 40px",
}

const fallbackLabel = {
  fontSize: "13px",
  color: "#737373",
  textAlign: "center" as const,
  margin: "0 0 10px",
}

const linkBox = {
  backgroundColor: "#FAFAFA",
  borderRadius: "6px",
  padding: "14px 16px",
  textAlign: "center" as const,
  border: "1px dashed #D4D4D4",
  display: "block",
  color: "#171717",
  fontSize: "12px",
  textDecoration: "none",
  wordBreak: "break-all" as const,
  lineHeight: "1.5",
}

const footerSection = {
  padding: "20px 40px 28px",
}

const footer = {
  color: "#737373",
  fontSize: "12px",
  lineHeight: "1.6",
  textAlign: "center" as const,
  margin: "0 0 6px",
}

const footerBrand = {
  color: "#A3A3A3",
  fontSize: "11px",
  fontWeight: "500",
  textAlign: "center" as const,
  margin: "14px 0 0 0",
  letterSpacing: "0.3px",
}
