const packageJson = require('../package.json')
import { consola } from "consola";
import { config } from "./config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { CommandHandler } from "./handlers/command_generic";

type EventHandler = any;

class sTinesClient extends Client {
  command_handler?: CommandHandler;
  event_handler?: EventHandler;
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

const commandHandler = new CommandHandler(client, {
  autoload: true
})

client.command_handler = commandHandler;

client.login(config.DISCORD_TOKEN);

export { client };
