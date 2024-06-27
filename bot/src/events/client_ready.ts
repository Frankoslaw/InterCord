import { Client } from "discord.js";
import { GenericContext, GenericEvent } from "../handlers/generic_handler";
import { Next, Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import { DiscordEventHandler } from "handlers/event_discord";
import { client } from "triggers/discord";


export const data: GenericEvent = {
    handlers: [
        new DiscordEventHandler (
            async (client: Client) => {
                let ctx = new GenericContext();

                ctx.client = client;

                return ctx;
            },
            async (ctx: GenericContext) => {
                if(ctx.client.user) {
                    ctx.client.user.setStatus('idle');
                }
            }
        ),
    ],
    steps: Pipeline<GenericContext>(
        ready_ex
    )
}

function ready_ex(ctx: GenericContext, next: Next) {
    logger.info("Bot is online( discord ).");
}
