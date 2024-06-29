import { AlignmentEnum, AsciiTable3 } from "ascii-table3";
import { Pipeline } from "../utils/pipeline";
import * as colors from "colors";

export class GenericContext {
    results: string [] = [];
    [key: string]: any;
}

export abstract class GenericTrigger {
    abstract to_ctx: (...args: any[]) => Promise<GenericContext>;
    abstract from_ctx: (ctx: GenericContext) => Promise<void>;
    abstract get_name: () => string | undefined;
    abstract register(unicord: UniCord, event: GenericEvent): void;
    execute: (unicord: UniCord, event: GenericEvent, ...args: any[]) => Promise<void> = async (unicord: UniCord, event: GenericEvent, ...args: any[]) => {
        let ctx = await this.to_ctx(unicord, event, ...args);
        let pipeline = Object.assign({}, event.steps);

        await pipeline.push(async (ctx: any, _next: any) => { this.from_ctx(ctx) })

        event.steps.execute(ctx)
    }
}

export abstract class GenericEvent {
    triggers: {
        [key: string]: GenericTrigger
    };
    steps: Pipeline<GenericContext>;

    get_name: (() => string | undefined) = () => {
        let name: string | undefined;

        Object.values(this.triggers).forEach((trigger: GenericTrigger) => {
            if(trigger.get_name() == undefined) return;

            name = trigger.get_name();
        })

        return name;
    }

    constructor(triggers: { [key: string]: GenericTrigger }, steps: Pipeline<GenericContext>) {
        this.triggers = triggers;
        this.steps = steps;
    }
}

export abstract class GenericCommand extends GenericEvent {
    name: string;
    description: string;

    constructor(name: string, description: string, triggers: { [key: string]: GenericTrigger }, steps: Pipeline<GenericContext>){
        super(triggers, steps);
        this.name = name;
        this.description = description;
    }
}

export interface IGenericHandlerOptions {
    autoload?: boolean;
    autoload_dir?: string;
}

export class GenericHandlerOptions implements IGenericHandlerOptions {
    autoload: boolean;
    autoload_dir: string;

    constructor({ autoload = true, autoload_dir = "./" }: IGenericHandlerOptions = {}) {
        this.autoload = autoload;
        this.autoload_dir = autoload_dir;
    }
}

export class UniCord {
    private events: GenericEvent[] = [];
    private commands: GenericCommand[] = [];
    private init_procedures: Array<(uniCord: UniCord) => void> = [];

    // For slack and discord.js clients
    [key: string]: any;

    public addEvent(event: GenericEvent): void {
        this.events.push(event);
    }

    public addCommand(command: GenericCommand): void {
        this.commands.push(command);
    }

    public init(procedure: (uniCord: UniCord) => void): void {
        this.init_procedures.push(procedure);
    }

    public run(): void {
        this.init_procedures.forEach(procedure => procedure(this));
    }

    public displayEvents() {
        this.display(this.events);
    }

    public displayCommands() {
        this.display(this.commands);
    }

    private display(items: GenericEvent[]): void {
        const table = new AsciiTable3(this.type + "s")
            .setHeading('#', 'Name', 'Status')
            .setAlign(3, AlignmentEnum.CENTER)

        let i = 1
        items.forEach((e) => {
            table.addRowMatrix([[i, e.get_name() || "", colors.green('ok')]])
            i++
        })

        console.log(table.toString())
    }
}
