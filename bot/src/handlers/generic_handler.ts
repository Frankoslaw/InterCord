import { Pipeline } from "../utils/pipeline";

// TODO: Allow for per command extension for better type checking
export class GenericContext {
    results: string[] = [];
    [key: string]: any;
}

export abstract class GenericHandler {
    abstract to_ctx: ( (...args: any[]) => Promise<GenericContext>);
    abstract from_ctx: ( (ctx: GenericContext, ...args: any[]) => Promise<void>);
    abstract execute: (...args: any[]) => Promise<void>;
}

export abstract class GenericEvent {
    handlers!: [GenericHandler];
    steps: Pipeline<GenericContext> = Pipeline<GenericContext>();
    abstract register: ((...args: any[]) => Promise<void>) | undefined;
}

export class GenericCommand extends GenericEvent{
    name!: string;
    description!: string;
    cooldown?: number; // Cooldown in ms
    register: ((...args: any[]) => Promise<void>) | undefined
}

export class GenericHandlerOptions{
    autoload?: boolean = false;
    autoload_dir?: string;
}
