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
    register(unicord: UniCord, event: GenericEvent): void {
        if(this.type == DiscordEventType.Once) {
            unicord.discord_client.once(this.name, (...args: any[]) => this.execute(unicord, event, ...args))
        }else{
            unicord.discord_client.on(this.name, (...args: any[]) => this.execute(unicord, event, ...args))
        }
    }
    to_ctx: (...args: any[]) => Promise<GenericContext>;
    from_ctx: (ctx: GenericContext) => Promise<void>;
    get_name = () => { return this.name }

    constructor(
        event: any,
        type: DiscordEventType,
        to_ctx: ((...args: any[]) => Promise<GenericContext>) | undefined = undefined,
        from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
    ) {
        super();

        this.name = event;
        this.type = type;
        this.to_ctx = to_ctx || (async () =>{ return new GenericContext() });
        this.from_ctx = from_ctx || (async () => { return; });
    }
}
