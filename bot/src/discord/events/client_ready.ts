import { Events } from "discord.js";
import { sTinesClient } from "../main";
import { logger } from "@utils/logger"
import { DiscordEvent, DiscordTriggerType } from "handlers/event_discord";

export const event = new DiscordEvent(
    Events.ClientReady,
    DiscordTriggerType.Once,
    async (client: sTinesClient) => {
      logger.info("Bot is online( discord ).");

      if(client.user) {
        client.user.setStatus('idle');
      }

      // Register commands
      // TODO: client.commandHandler.registerGuildCommands(GUILD_ID)
    }
)
