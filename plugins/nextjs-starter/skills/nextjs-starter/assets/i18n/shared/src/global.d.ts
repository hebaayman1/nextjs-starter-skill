import type messages from "../messages/%%DEFAULT_LOCALE%%.json"

// Type-checks every t("key") against the default locale's messages.
declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages
  }
}
