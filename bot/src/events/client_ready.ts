import { Client, Events } from "discord.js";
import { Next, Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import { GenericContext, GenericEvent } from "handlers/generic_handler";
import { DiscordEventTrigger, DiscordEventType } from "handlers/event_discord";


export const event = new GenericEvent(
    [
        new DiscordEventTrigger (
            Events.ClientReady,
            DiscordEventType.Once,
            async (client: Client) => {
                let ctx: any = {};

                ctx.client = client;

                return ctx;
            },
            async (ctx: GenericContext) => {
                if(ctx.status && ctx.client.user) {
                    ctx.client.user.setStatus(ctx.status);
                }
            }
        ),
    ],
    Pipeline<GenericContext>(
        (ctx: GenericContext, next: Next) => {
            logger.info("Bot is online( discord ).");
        },
        (ctx: GenericContext, _next: Next) => {
            ctx.status = "idle";
        }
    )
)
