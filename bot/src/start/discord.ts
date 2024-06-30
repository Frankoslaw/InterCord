import { config } from "@config";
import { Client, GatewayIntentBits, Partials } from "discord.js";

const discord_client: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

discord_client.login(config.DISCORD_TOKEN);

export { discord_client };
