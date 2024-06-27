import { Interaction, SlashCommandBuilder } from "discord.js";
import { GenericHandler, UniversalContext } from "./command_generic";

// TODO: Add support for legacy message commands
export class DiscordHandler extends GenericHandler {
    slash_command_builder?: SlashCommandBuilder;
    to_ctx: (interaction: Interaction) => UniversalContext;
    from_ctx: () => void;

    constructor(
        slash_command_builder: SlashCommandBuilder,
        to_ctx: ( (interaction: Interaction) => UniversalContext ) | undefined,
        from_ctx: ( () => void ) | undefined
    ) {
        super();

        this.slash_command_builder = slash_command_builder;

        this.to_ctx = to_ctx || ((_interaction: Interaction) => {
            return new UniversalContext();
        })

        this.from_ctx = from_ctx || (() => {
            return;
        })
    }
}
