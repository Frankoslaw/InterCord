import { SlashCommandBuilder } from "discord.js";
import { Pipeline } from "../utils/pipeline";
import { GenericCommand, GenericContext } from "handlers/generic_handler";
import { DiscordCommandTrigger } from "handlers/command_discord";
import {
  ExpressCommandTrigger,
  ExpressMethodType,
} from "handlers/command_express";

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
  },
  Pipeline<GenericContext>((ctx, next) => {
    ctx.results.push("Pong!");

    next();
  })
);
