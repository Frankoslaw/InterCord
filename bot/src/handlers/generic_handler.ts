import { Pipeline } from "../utils/pipeline";

export class GenericContext {
    results: string [] = [];
    [key: string]: any;
}

export abstract class GenericTrigger {
    abstract to_ctx: (...args: any[]) => Promise<GenericContext>;
    abstract from_ctx: (ctx: GenericContext) => Promise<void>;
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
    events: GenericEvent [] = [];
    init_procedures: ((...args: any[]) => void) [] = [];
    // For slack and discord.js clients
    [key: string]: any;

    add_init_procedure(procedure: (...args: any[]) => void) {
        this.init_procedures.push(procedure)
    }

    add_event(event: GenericEvent) {
        this.events.push(event)
    }

    init() {
        this.init_procedures.forEach((procedure) => {
            procedure(this);
        })
    }
}
