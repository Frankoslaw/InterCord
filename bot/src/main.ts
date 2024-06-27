import 'module-alias/register';
import { UniCord } from 'handlers/generic_handler';
import { event as client_ready } from 'events/client_ready';
import { event as interaction_create } from 'events/interaction_create';
import { discord_client } from "./start/discord";
import { DiscordEventHandler } from 'handlers/event_discord';
import path from 'path';

// COMMON CODE
const bot = new UniCord();

bot.events = [client_ready, interaction_create];

// DISCORD SECTION
const discord_event_handler = new DiscordEventHandler(bot, {
    autoload: true,
    autoload_dir: path.join(__dirname + "/events")
});
bot.discord_client = discord_client;

// SLACK SECTION
// TODO:

// EXPRESS SECTION
// TODO:

// START BOT
bot.run();
