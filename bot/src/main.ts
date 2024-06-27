// TODO: Cleanup alias paths and start using them
import 'module-alias/register';

// COMMON CODE
import { UniCord } from 'handlers/generic_handler';
import { event } from 'events/client_ready';
const bot = new UniCord();

bot.add_event(event);

// DISCORD SECTION
import { discord_client } from "./start/discord";
import { discord_init_procedure } from 'handlers/event_discord';

bot.discord_client = discord_client;
bot.add_init_procedure(discord_init_procedure);

// SLACK SECTION
// TODO:

// EXPRESS SECTION
// TODO:

// START BOT
bot.init();
