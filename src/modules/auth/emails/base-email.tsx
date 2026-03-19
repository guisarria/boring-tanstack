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

type EmailLayoutProps = {
  name: string
  url: string
  previewText: string
  heading: string
  greeting: string
  bodyText: string
  buttonText: string
  footerText: string
}

function getInitials(name?: string): string {
  if (!name) return ""
  const parts = name.trim().split(" ")
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name[0].toUpperCase()
}

export function EmailLayout({
  name,
  url,
  previewText,
  heading,
  greeting,
  bodyText,
  buttonText,
  footerText,
}: EmailLayoutProps) {
  const initials = getInitials(name)

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            <Text style={styles.logoText}>Boring TanStack</Text>
          </Section>

          <Section style={styles.heroSection}>
            <Section style={styles.iconCircle}>
              <Text style={styles.iconText}>{initials}</Text>
            </Section>

            <Heading as="h1" style={styles.heading}>
              {heading}
            </Heading>

            <Text style={styles.greetingText}>{greeting}</Text>

            <Text style={styles.paragraph}>{bodyText}</Text>
          </Section>

          <Section style={styles.buttonSection}>
            <Button href={url} style={styles.button}>
              {buttonText}
            </Button>
          </Section>

          <Section style={styles.timerSection}>
            <Text style={styles.timerText}>This link expires in 24 hours</Text>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.fallbackSection}>
            <Text style={styles.fallbackLabel}>
              Having trouble? Click the button or copy the link below:
            </Text>
            <Link href={url} style={styles.linkBox}>
              {url}
            </Link>
          </Section>

          <Hr style={styles.hr} />

          <Section style={styles.footerSection}>
            <Text style={styles.footer}>{footerText}</Text>
            <Text style={styles.footerBrand}>
              © {new Date().getFullYear()} Boring TanStack. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  main: {
    backgroundColor: "#F5F5F4",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  container: {
    margin: "0 auto",
    backgroundColor: "#FFFFFF",
    overflow: "hidden" as const,
    border: "1px solid #E5E5E5",
  },
  logoSection: {
    padding: "28px 40px 24px",
    textAlign: "center" as const,
    borderBottom: "1px solid #F5F5F4",
  },
  logoText: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#171717",
    letterSpacing: "0.5px",
    margin: "0",
  },
  heroSection: {
    padding: "40px 40px 32px",
    textAlign: "center" as const,
  },
  iconCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "#F5F5F4",
    margin: "0 auto 24px",
    lineHeight: "80px",
    textAlign: "center" as const,
    border: "1px solid #E5E5E5",
  },
  iconText: {
    fontSize: "28px",
    lineHeight: "74px",
    margin: "0",
    color: "#171717",
    fontWeight: "700",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#171717",
    margin: "0 0 12px",
    letterSpacing: "-0.4px",
  },
  greetingText: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#525252",
    fontWeight: "600",
    margin: "0 0 20px",
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#525252",
    margin: "0",
  },
  buttonSection: {
    padding: "20px 40px 16px",
    textAlign: "center" as const,
  },
  button: {
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
  },
  timerSection: {
    padding: "0 0 36px",
    textAlign: "center" as const,
  },
  timerText: {
    fontSize: "13px",
    color: "#737373",
    margin: "0",
    fontWeight: "500",
  },
  hr: {
    borderColor: "#F5F5F4",
    margin: "0",
  },
  fallbackSection: {
    padding: "20px 40px",
  },
  fallbackLabel: {
    fontSize: "13px",
    color: "#737373",
    textAlign: "center" as const,
    margin: "0 0 10px",
  },
  linkBox: {
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
  },
  footerSection: {
    padding: "20px 40px 28px",
  },
  footer: {
    color: "#737373",
    fontSize: "12px",
    lineHeight: "1.6",
    textAlign: "center" as const,
    margin: "0 0 6px",
  },
  footerBrand: {
    color: "#A3A3A3",
    fontSize: "11px",
    fontWeight: "500",
    textAlign: "center" as const,
    margin: "14px 0 0 0",
    letterSpacing: "0.3px",
  },
} as const
