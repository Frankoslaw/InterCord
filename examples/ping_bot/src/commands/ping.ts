import { SlashCommandBuilder } from "discord.js";
import {
  Pipeline,
  GenericCommand,
  GenericContext,
  DiscordCommandTrigger,
  ExpressCommandTrigger,
  ExpressMethodType,
  SlackCommandTrigger,
} from "@frankoslaw/intercord";

export const command = new GenericCommand(
  "ping",
  "Test ping command using UniCord",
  {
    discord_trigger: new DiscordCommandTrigger(
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!")
    ),
    express_trigger: new ExpressCommandTrigger(
      ExpressMethodType.GET,
      "/commands/ping"
    ),
    slack_trigger: new SlackCommandTrigger("ping", false),
  },
  Pipeline<GenericContext>((ctx, next) => {
    ctx.results.push("Pong!");

    next();
  })
);
