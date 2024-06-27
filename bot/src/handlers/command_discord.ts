import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { GenericHandler, UniversalContext } from "./command_generic";

// TODO: Add support for legacy message commands
export class DiscordHandler extends GenericHandler {
    slash_command_builder?: SlashCommandBuilder;
    to_ctx: (interaction: CommandInteraction) => Promise<UniversalContext>;
    from_ctx: (ctx: UniversalContext, interaction: CommandInteraction) => Promise<void>;

    constructor(
        slash_command_builder: SlashCommandBuilder,
        to_ctx: ( (interaction: CommandInteraction) => Promise<UniversalContext> ) | undefined,
        from_ctx: ( (ctx: UniversalContext, interaction: CommandInteraction) => Promise<void> ) | undefined
    ) {
        super();

        this.slash_command_builder = slash_command_builder;

        this.to_ctx = to_ctx || (async (interaction: CommandInteraction) => {
            let ctx = new UniversalContext();

            ctx.client  = interaction.client;
            ctx.member  = interaction.member;
            ctx.user    = interaction.user;
            ctx.guild   = interaction.guild;
            ctx.channel = interaction.channel;

            return ctx;
        })

        this.from_ctx = from_ctx || (async (ctx: UniversalContext, interaction: CommandInteraction) => {
            ctx.results.forEach(async (result) => {
                await interaction.reply(result);
            })
        })
    }
}
