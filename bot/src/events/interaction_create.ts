import { Events, Interaction } from "discord.js";
import { Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import { GenericCommand, GenericContext, GenericEvent, UniCord } from "handlers/generic_handler";
import { DiscordEventTrigger, DiscordEventType } from "handlers/event_discord";


export const event = new GenericEvent(
    {
        discord_trigger: new DiscordEventTrigger (
            Events.InteractionCreate,
            DiscordEventType.On,
            async (unicord: UniCord, interaction: Interaction) => {
                let ctx = new GenericContext();

                ctx.unicord = unicord;
                ctx.interaction = interaction;

                return ctx;
            },
            async (ctx: GenericContext) => {}
        ),
    },
    Pipeline<GenericContext>(
        (ctx, next) => {
            const command = ctx.unicord.commands.get(ctx.interaction.commandName) as GenericCommand;

            if(!command) return;

            const trigger = command.triggers?.discord_trigger as DiscordEventTrigger;

            if(!trigger) return;

            trigger.execute(ctx.unicord, command, ctx.interaction);
            next();
        }
    )
)
