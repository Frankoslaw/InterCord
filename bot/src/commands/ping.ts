import { SlashCommandBuilder } from "discord.js";
import  { Pipeline } from "../utils/pipeline";
import { GenericContext } from "handlers/generic_handler";

class GenericCommand {
    constructor(a: string, b: string, c: any, d: Pipeline<GenericContext>) {

    }
}

class DiscordCommandTrigger {
    constructor(a: any, b: any=undefined, c: any=undefined) {

    }
}

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
            ctx.results.push("Pong!");
            ctx.results.push("Multiple responses test!");

            next();
        }
    )
)
