import { config } from "@config";
import { App } from "@slack/bolt";
import { logger } from "@utils/logger";

const slack_client = new App({
  appToken: config.SLACK_APP_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
  token: config.SLACK_BOT_TOKEN,
  socketMode: true,
  port: (config.SLACK_PORT || 3000) as number,
});

(async () => {
  const port = 3000;
  await slack_client.start(config.SLACK_PORT || port);
  logger.info("Bot is online( slack ).");
})();

export { slack_client };
