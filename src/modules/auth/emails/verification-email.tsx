import { EmailLayout } from "./base-email"

type EmailVerificationData = {
  name: string
  url: string
}

export default function VerificationEmail({
  name,
  url,
}: EmailVerificationData) {
  return (
    <EmailLayout
      name={name}
      url={url}
      previewText={
        name
          ? `${name}, verify your email to get started with Boring TanStack`
          : "Verify your email to get started with Boring TanStack"
      }
      heading="Verify your email"
      greeting={name ? `Welcome, ${name}!` : "Welcome!"}
      bodyText="Click the button below to verify your email address & activate your account. Once verified, you'll have full access to all features."
      buttonText="Verify Email"
      footerText="You received this email because a new account was created with this address. If this wasn't you, you can safely ignore this email."
    />
  )
}
