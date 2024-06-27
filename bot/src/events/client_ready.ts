import { Client, Events, RPCCloseEventCodes } from "discord.js";
import { Next, Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import { client } from "start/discord";

enum DiscordEventType {
    On = "On",
    Once = "Once"
}
class DiscordEventTrigger {
    name: Events;
    type: DiscordEventType;
    to_ctx: any;
    from_ctx: any;

    constructor(event: any, type: DiscordEventType, to_ctx: any, from_ctx: any) {
        this.name = event;
        this.type = type;
        this.to_ctx = to_ctx;
        this.from_ctx = from_ctx;
    }
}

const event: any = {
    triggers: [
        new DiscordEventTrigger (
            Events.ClientReady,
            DiscordEventType.Once,
            async (client: Client) => {
                let ctx: any = {};

                ctx.client = client;

                return ctx;
            },
            async (ctx: any) => {
                if(ctx.status && ctx.client.user) {
                    ctx.client.user.setStatus(ctx.status);
                }
            }
        ),
    ],
    steps: Pipeline<any>(
        (ctx: any, next: Next) => {
            logger.info("Bot is online( discord ).");
            ctx.status = "idle"
        }
    )
}

let events = [event];

events.forEach((e) => {
    e.triggers.forEach((trigger: any) => {

        const execute = (...args: any[]) => {
            let ctx = trigger.to_ctx(...args);

            let pipeline = Object.assign({}, e.steps)
            pipeline.push((ctx: any, _next: any) => {
                trigger.from_ctx(ctx)
            })

            e.steps.execute(ctx)
        }

        if(trigger.type == DiscordEventType.Once) {
            client.once(trigger.name, (...args) => execute(...args))
        }else{
            client.on(trigger.name, (...args) => execute(...args))
        }
    })
})
