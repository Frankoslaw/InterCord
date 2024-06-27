const packageJson = require('../../package.json')
import { consola } from "consola";
import { config } from "@config";
import { Client, GatewayIntentBits, Partials } from "discord.js";

const client: Client = new Client({
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

client.login(config.DISCORD_TOKEN);

export { client };
