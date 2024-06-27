import { Client, Events } from "discord.js";
import { Pipeline } from "@utils/pipeline";

// TODO: Allow for per command extension for better type checking
export class GenericContext {
    results: string[] = [];
    [key: string]: any;
}

class DiscordProvider {
    client: Client

    constructor(client: Client) {
        this.client = client;
    }
}

enum DiscordTriggerType {
    On = "On",
    Once = "Once"
}

abstract class GenericEventHandler {
    abstract to_ctx: (...args: any[]) => Promise<GenericContext>;
    abstract from_ctx: (ctx: GenericContext) => Promise<void>;
}

class DiscordEventHandler extends GenericEventHandler {
    name: Events;
    trigger_type: DiscordTriggerType;
    to_ctx: (...args: any[]) => Promise<GenericContext>;
    from_ctx: (ctx: GenericContext) => Promise<void>;

    constructor(
        name: Events,
        trigger_type: DiscordTriggerType,
        to_ctx: (...args: any[]) => Promise<GenericContext>,
        from_ctx: (ctx: GenericContext) => Promise<void>
    ) {
        super()

        this.name = name;
        this.trigger_type = trigger_type;
        this.to_ctx = to_ctx;
        this.from_ctx = from_ctx;
    }
}
