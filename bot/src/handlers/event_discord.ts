import { Events } from "discord.js";
import { GenericContext, GenericEvent, GenericHandlerOptions, GenericTrigger, UniCord } from "./generic_handler";
import { DiscordHandler, DiscordHandlerType } from "./common_discord";


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

export class DiscordEventHandler extends DiscordHandler {
    load_event: (unicord: UniCord, event: any) => void = (unicord: UniCord, event: GenericEvent) => {
        const trigger = event.triggers?.discord_trigger as DiscordEventTrigger;

        if(!trigger) {
            return;
        }

        const execute = async (...args: any[]) => {
            let ctx= new GenericContext();
            if( trigger.to_ctx ){
                ctx = await trigger.to_ctx(...args);
            }

            let pipeline = Object.assign({}, event.steps)
            await pipeline.push(async (ctx: any, _next: any) => {
                if( !trigger.from_ctx ){
                    return;
                }

                trigger.from_ctx(ctx)
            })

            event.steps.execute(ctx)
        }

        if(trigger.type == DiscordEventType.Once) {
            unicord.discord_client.once(trigger.name, (...args: any[]) => execute(...args))
        }else{
            unicord.discord_client.on(trigger.name, (...args: any[]) => execute(...args))
        }
    }

    constructor(unicord: UniCord, options: GenericHandlerOptions) {
        super(unicord, options, DiscordHandlerType.Event);
    }
}
