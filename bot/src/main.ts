import "module-alias/register";
import packageJson from "../package.json";
import { consola } from "consola";
import { GenericHandler, UniCord } from "handlers/generic_handler";
import path from "path";

// COMMON CODE
const bot = new UniCord();

consola.start(`Starting app '${packageJson.name}'`);
consola.box(
  `Project: sTINES bot\nAuthor:  ${packageJson.author}\nVersion: ${packageJson.version}`,
);

const _event_handler = new GenericHandler(
  bot,
  {
    autoload: true,
    autoload_dir: path.join(__dirname + "/events"),
  },
  () => {
    bot.displayEvents();
  },
);
const _command_handler = new GenericHandler(
  bot,
  {
    autoload: true,
    autoload_dir: path.join(__dirname + "/commands"),
  },
  () => {
    bot.displayCommands();
  },
);

// DISCORD SECTION
import { discord_client } from "./start/discord";
bot.discord_client = discord_client;

// SLACK SECTION
import { slack_client } from "./start/slack";
bot.slack_client = slack_client;

// EXPRESS SECTION
// TODO:

// START BOT
bot.run();
