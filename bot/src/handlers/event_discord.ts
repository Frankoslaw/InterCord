import { Events } from "discord.js";
import { GenericContext, GenericTrigger, UniCord } from "./generic_handler";

export enum DiscordEventType {
    On = "On",
    Once = "Once"
}

export class DiscordEventTrigger extends GenericTrigger {
    name: Events;
    type: DiscordEventType;
    to_ctx: (...args: any[]) => Promise<GenericContext>;
    from_ctx: (ctx: GenericContext) => Promise<void>;

    constructor(event: any, type: DiscordEventType, to_ctx: any, from_ctx: any) {
        super();

        this.name = event;
        this.type = type;
        this.to_ctx = to_ctx;
        this.from_ctx = from_ctx;
    }
}

export const discord_init_procedure = (uni_cord: UniCord) => {
    uni_cord.events.forEach((event) => {
        const trigger = event.triggers.filter((t) => t instanceof DiscordEventTrigger)[0];

        if(!trigger) {
            return;
        }

        const discord_trigger = trigger as DiscordEventTrigger;

        const execute = async (...args: any[]) => {
            let ctx = await discord_trigger.to_ctx(...args);

            let pipeline = Object.assign({}, event.steps)
            await pipeline.push(async (ctx: any, _next: any) => {
                discord_trigger.from_ctx(ctx)
            })

            event.steps.execute(ctx)
        }

        if(discord_trigger.type == DiscordEventType.Once) {
            uni_cord.discord_client.once(discord_trigger.name, (...args: any[]) => execute(...args))
        }else{
            uni_cord.discord_client.on(discord_trigger.name, (...args: any[]) => execute(...args))
        }
    })
}
