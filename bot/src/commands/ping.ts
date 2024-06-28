import { SlashCommandBuilder } from "discord.js";
import  { Pipeline } from "../utils/pipeline";
import { GenericCommand, GenericContext } from "handlers/generic_handler";
import { DiscordCommandTrigger } from "handlers/command_discord";
import { logger } from "@utils/logger";

export const command = new GenericCommand(
    "ping",
    "Test ping command using UniCord",
    {
        discord_trigger: new DiscordCommandTrigger(
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Replies with Pong!")
        )
    },
    Pipeline<GenericContext>(
        (ctx, next) => {
            logger.info("Command triggered: " + "ping");
            next();
        },
        (ctx, next) => {
            ctx.results.push("Pong!");
            ctx.results.push("Multiple responses test!");

            next();
        }
    )
)
