import dotenv from "dotenv";

dotenv.config();

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_PORT,
  EXPRESS_PORT,
} = process.env;

if (
  !DISCORD_TOKEN ||
  !DISCORD_CLIENT_ID ||
  !SLACK_APP_TOKEN ||
  !SLACK_BOT_TOKEN ||
  !SLACK_SIGNING_SECRET
) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  SLACK_APP_TOKEN,
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_PORT,
  EXPRESS_PORT,
};
