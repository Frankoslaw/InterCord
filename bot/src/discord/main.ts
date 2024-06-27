const packageJson = require('../../package.json')
import { consola } from "consola";
import { config } from "@config";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { CommandHandler } from "../handlers/command_generic";
import { DiscordEvent, DiscordEventHandler } from "handlers/event_discord";

type EventHandler = any;

export class sTinesClient extends Client {
  command_handler?: CommandHandler;
  event_handler?: EventHandler;
  events?: Collection<string, DiscordEvent>
}

const client: sTinesClient = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
  ],
  partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
  ],
})

consola.start(`Starting app '${packageJson.name}'`)
consola.box(`Project: sTINES bot\nAuthor:  ${packageJson.author}\nVersion: ${packageJson.version}`)

// TODO: Path setup should be done here
// TODO: This does not belong here as it is common part
const command_handler = new CommandHandler({
  autoload: true
})

// TODO: Add options to config events
// TODO: Unify event definitions using same architecture as commands
const event_handler = new DiscordEventHandler(client)

client.command_handler = command_handler;
client.event_handler = event_handler;

client.login(config.DISCORD_TOKEN);

export { client };
