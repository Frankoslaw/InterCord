import packageJson from "../package.json";
import { consola } from "consola";
import path from "path";

import {
  InterCord,
  GenericHandler,
  default_discord_client,
  default_slack_client,
  default_express_client,
  default_interaction_create,
} from "@frankoslaw/intercord";

// COMMON CODE
const bot = new InterCord();

consola.start(`Starting app '${packageJson.name}'`);
consola.box(
  `Project: sTINES bot\nAuthor:  ${packageJson.author}\nVersion: ${packageJson.version}`
);

const _event_handler = new GenericHandler(
  bot,
  {
    autoload: true,
    autoload_dir: path.join(__dirname + "/events"),
  },
  () => {
    bot.displayEvents();
  }
);
const _command_handler = new GenericHandler(
  bot,
  {
    autoload: true,
    autoload_dir: path.join(__dirname + "/commands"),
  },
  () => {
    bot.displayCommands();
  }
);

// PLATFROM SPECIFIC CLIENTS
bot.discord_client = default_discord_client;
bot.slack_client = default_slack_client;
bot.express_client = default_express_client;

// START BOT + small hack
bot.addEvent(default_interaction_create);
Object.values(default_interaction_create.triggers).forEach((trigger: any) => {
  trigger.register(bot, default_interaction_create);
});

bot.run();
