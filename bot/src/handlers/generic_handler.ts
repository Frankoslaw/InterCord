import { Pipeline } from "../utils/pipeline";

export class GenericContext {
    results: string [] = [];
    [key: string]: any;
}

export abstract class GenericTrigger {
    abstract to_ctx: ((...args: any[]) => Promise<GenericContext>) | undefined;
    abstract from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined;
}

export class GenericEvent {
    triggers: GenericTrigger [];
    steps: Pipeline<GenericContext>;

    constructor(triggers: GenericTrigger [], steps: Pipeline<GenericContext>) {
        this.triggers = triggers;
        this.steps = steps;
    }
}

export class UniCord {
    public events: GenericEvent [] = [];
    init_procedures: ((...args: any[]) => void) [] = [];
    // For slack and discord.js clients
    [key: string]: any;

    init(procedure: (...args: any[]) => void) {
        this.init_procedures.push(procedure)
    }

    run() {
        this.init_procedures.forEach((procedure) => {
            procedure(this);
        })
    }
}
