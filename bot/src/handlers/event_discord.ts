import { Events } from "discord.js";
import { GenericContext, GenericEvent, GenericHandler, GenericHandlerOptions, GenericTrigger, UniCord } from "./generic_handler";
import { logger } from "@utils/logger";
import * as fs from "fs";
import path from "path";
import { AlignmentEnum, AsciiTable3 } from "ascii-table3";
import * as colors from "colors";


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

export class DiscordEventHandler extends GenericHandler {
    events_dir: string = "";

    constructor(unicord: UniCord, options: GenericHandlerOptions) {
        super();

        this.options = Object.assign(
            new GenericHandlerOptions(true, undefined),
            options
        );
        unicord.events = [];

        if (this.options.autoload) {
            logger.info('Auto loading all events from:', this.options.autoload_dir);
            this.events_dir = this.options.autoload_dir || "";

            this.auto_load_events(unicord).then(() => {
                this.display_loaded_events(unicord);
            })
        }
    }

    async load_event(unicord: UniCord, event: GenericEvent) {
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

    async auto_load_events(unicord: UniCord) {
        if (!fs.existsSync(this.events_dir)) {
            logger.error('Events directory does not exist.')
            return
        }

        const event_files = fs
            .readdirSync(this.events_dir)
            .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))

        for (const file of event_files) {
            const file_path = path.join(this.events_dir, file)
            const { event }: { event: GenericEvent } = await import(file_path);
            unicord.events.push(event);
            this.load_event(unicord, event);
        }
    }

    async display_loaded_events(unicord: UniCord) {
        // create table
        const table = new AsciiTable3('Events')
            .setHeading('#', 'Name', 'Message')
            .setAlign(3, AlignmentEnum.CENTER)

        let i = 1
        unicord.events.forEach((event) => {
            const trigger = event.triggers?.discord_trigger as DiscordEventTrigger;

            if(!trigger) {
                return;
            }

            table.addRowMatrix([[i, trigger.name, colors.green('ok')]])
            i++
        })

        console.log(table.toString())
    }
}
