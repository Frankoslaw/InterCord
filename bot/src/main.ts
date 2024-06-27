import 'module-alias/register';
import { UniCord } from 'handlers/generic_handler';
import { event as client_ready } from 'events/client_ready';
import { event as interaction_create } from 'events/interaction_create';
import { discord_client } from "./start/discord";
import { discord_init } from 'handlers/event_discord';

// COMMON CODE
const bot = new UniCord();

bot.events = [client_ready, interaction_create];

// DISCORD SECTION
bot.discord_client = discord_client;
bot.init(discord_init);

// SLACK SECTION
// TODO:

// EXPRESS SECTION
// TODO:

// START BOT
bot.run();
