import { Client, Collection } from "discord.js";
import { Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";

// TODO: Allow for per command extension for better type checking
export class UniversalContext {
    results: string[] = [];
    [key: string]: any;
}

export abstract class GenericHandler {
    abstract to_ctx(...args: any[]): Promise<UniversalContext> | UniversalContext;
    abstract from_ctx(ctx: UniversalContext, ...args: any[]): Promise<void> | void;
}

export class UniversalCommand {
    name!: string;
    description!: string;
    handlers!: [GenericHandler];
    steps: Pipeline<UniversalContext> = Pipeline<UniversalContext>()
}

export class CommandHandlerOptions{
    autoload?: boolean = false;
    autoload_dir?: string = "../commands";
}

export class CommandHandler {
    commands: Collection<string, UniversalCommand> = new Collection();
    commands_dir: string | undefined;
    options: CommandHandlerOptions = new CommandHandlerOptions();

    constructor(options: CommandHandlerOptions) {
        this.options = Object.assign(this.options, options)

        if(this.options.autoload) {
            this.autoload_commands()
        }
    }

    autoload_commands() {
        logger.warn("TODO: No commands loaded")
    }
}
