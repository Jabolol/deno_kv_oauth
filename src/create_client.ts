import { assert } from "https://deno.land/std@0.189.0/testing/asserts.ts";
import { OAuth2Client, OAuth2ClientConfig } from "../deps.ts";

export type Provider = "discord" | "github";

/** @todo Define required config via types instead of assertions. */
function createDiscordClientConfig(
  moreOAuth2ClientConfig?: Partial<OAuth2ClientConfig>,
): OAuth2ClientConfig {
  assert(moreOAuth2ClientConfig?.redirectUri, "`redirectUri` must be defined");
  assert(
    moreOAuth2ClientConfig?.defaults?.scope,
    "`defaults.scope` must be defined",
  );
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("DISCORD_CLIENT_ID")!,
    clientSecret: Deno.env.get("DISCORD_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://discord.com/oauth2/authorize",
    tokenUri: "https://discord.com/api/oauth2/token",
  };
}

function createGitHubClientConfig(
  moreOAuth2ClientConfig?: Partial<OAuth2ClientConfig>,
): OAuth2ClientConfig {
  return {
    ...moreOAuth2ClientConfig,
    clientId: Deno.env.get("GITHUB_CLIENT_ID")!,
    clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET")!,
    authorizationEndpointUri: "https://github.com/login/oauth/authorize",
    tokenUri: "https://github.com/login/oauth/access_token",
  };
}

export function createClient(
  provider: Provider,
  moreOAuth2ClientConfig?: Partial<OAuth2ClientConfig>,
): OAuth2Client {
  switch (provider) {
    case "discord":
      return new OAuth2Client(
        createDiscordClientConfig(moreOAuth2ClientConfig),
      );
    case "github":
      return new OAuth2Client(createGitHubClientConfig(moreOAuth2ClientConfig));
    default:
      throw new Error(`Provider ID "${provider}" not supported`);
  }
}
