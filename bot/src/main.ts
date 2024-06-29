import "module-alias/register";
import { GenericHandler, UniCord } from "handlers/generic_handler";
import path from "path";

// COMMON CODE
const bot = new UniCord();

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

// DISCORD SECTION
import { discord_client } from "./start/discord";
bot.discord_client = discord_client;

// SLACK SECTION
// TODO:

// EXPRESS SECTION
// TODO:

// START BOT
bot.run();
