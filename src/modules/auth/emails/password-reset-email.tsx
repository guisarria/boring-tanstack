import { EmailLayout } from "./base-email"

type PasswordResetData = {
  name: string
  url: string
}

export default function PasswordResetEmail({ name, url }: PasswordResetData) {
  return (
    <EmailLayout
      name={name}
      url={url}
      previewText={
        name
          ? `${name}, reset your password for Boring TanStack`
          : "Reset your password for Boring TanStack"
      }
      heading="Reset your password"
      greeting={name ? `Hi, ${name}!` : "Hi!"}
      bodyText="A password reset was requested for your account. Click the button below to choose a new password. If you didn't request this, you can safely ignore this email."
      buttonText="Reset Password"
      footerText="You received this email because a password reset was requested for your account. If this wasn't you, you can safely ignore this email."
    />
  )
}
