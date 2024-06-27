import { Events, Interaction } from "discord.js";
import { Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import { GenericContext, GenericEvent } from "handlers/generic_handler";
import { DiscordEventTrigger, DiscordEventType } from "handlers/event_discord";


export const event = new GenericEvent(
    [
        new DiscordEventTrigger (
            Events.InteractionCreate,
            DiscordEventType.On,
            async (interaction: Interaction) => {
                let ctx = new GenericContext();
                ctx.interaction = interaction;
                return ctx;
            },
            async (ctx: GenericContext) => {}
        ),
    ],
    Pipeline<GenericContext>(
        (_ctx, next) => {
            logger.info("Someone interacted with the bot");
            next()
        },
        (ctx, _next) => {
            const { commandName: command_name } = ctx.interaction;

            logger.info(`Command name: ${command_name}`)
        }
    )
)
