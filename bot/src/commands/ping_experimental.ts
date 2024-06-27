import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { UniversalCommand, UniversalContext } from "../handlers/command_generic";
import { Next, Pipeline } from "../utils/pipeline";
import { DiscordHandler } from "../handlers/command_discord";


export const data: UniversalCommand = {
    name: "ping",
    description: "Test ping command using UniCord",
    handlers: [
        new DiscordHandler (
            new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Replies with Pong!"),
            undefined,
            undefined
        )
    ],
    steps: Pipeline<UniversalContext>(
        ping_ex
    )
}

function ping_ex(ctx: UniversalContext, next: Next) {
    next()
}
