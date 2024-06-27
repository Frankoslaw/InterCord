import { Events } from "discord.js";
import { GenericContext, GenericTrigger, UniCord } from "./generic_handler";

export enum DiscordEventType {
    On = "On",
    Once = "Once"
}

export class DiscordEventTrigger extends GenericTrigger {
    name: Events;
    type: DiscordEventType;
    to_ctx: ((...args: any[]) => Promise<GenericContext>) | undefined;
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined;

    constructor(
        event: any,
        type: DiscordEventType,
        to_ctx: ((...args: any[]) => Promise<GenericContext>) | undefined = undefined,
        from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
    ) {
        super();

        this.name = event;
        this.type = type;
        this.to_ctx = to_ctx;
        this.from_ctx = from_ctx;
    }
}

export const discord_init = (uni_cord: UniCord) => {
    uni_cord.events.forEach((event) => {
        const trigger = event.triggers.filter((t) => t instanceof DiscordEventTrigger)[0];

        if(!trigger) {
            return;
        }

        const discord_trigger = trigger as DiscordEventTrigger;

        const execute = async (...args: any[]) => {
            let ctx= new GenericContext();
            if( discord_trigger.to_ctx ){
                ctx = await discord_trigger.to_ctx(...args);
            }

            let pipeline = Object.assign({}, event.steps)
            await pipeline.push(async (ctx: any, _next: any) => {
                if( !discord_trigger.from_ctx ){
                    return;
                }

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
