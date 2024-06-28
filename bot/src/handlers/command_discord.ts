import { SlashCommandBuilder } from "discord.js";
import { GenericContext, GenericHandlerOptions, GenericTrigger, UniCord } from "./generic_handler";
import { DiscordHandler, DiscordHandlerType } from "./common_discord";


// TODO: A lot of this is redundant to event trigger
export class DiscordCommandTrigger extends GenericTrigger {
    slash: SlashCommandBuilder;
    to_ctx: ((...args: any[]) => Promise<GenericContext>) | undefined;
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined;

    constructor(
        slash: SlashCommandBuilder,
        to_ctx: ((...args: any[]) => Promise<GenericContext>) | undefined = undefined,
        from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
    ) {
        super();

        this.slash = slash;
        this.to_ctx = to_ctx;
        this.from_ctx = from_ctx;
    }
}

export class DiscordCommandHandler extends DiscordHandler {
    constructor(unicord: UniCord, options: GenericHandlerOptions) {
        super(unicord, options, DiscordHandlerType.Command);
    }
}
