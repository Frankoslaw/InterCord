import { config } from "@config";
import { App } from "@slack/bolt";
import { logger } from "@utils/logger";

const slack_client = new App({
  appToken: config.SLACK_APP_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
  token: config.SLACK_BOT_TOKEN,
  socketMode: true,
  port: (process.env.PORT || 3000) as number,
});

(async () => {
  await slack_client.start();
  logger.info("Bot is online( slack ).");
})();

export { slack_client };
