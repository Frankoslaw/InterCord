import * as colors from "colors";
import * as fs from "fs";
import { GenericHandler, GenericHandlerOptions, UniCord } from "./generic_handler";
import { logger } from "@utils/logger";
import { DiscordEventTrigger } from "./event_discord";
import path from "path";
import { AlignmentEnum, AsciiTable3 } from "ascii-table3";

export enum DiscordHandlerType {
    Event = "Event",
    Command = "Command"
}

export class DiscordHandler extends GenericHandler {
    load_dir: string = "";
    type: DiscordHandlerType;
    options: GenericHandlerOptions;
    load_event: ((unicord: UniCord, event: any) => void) | undefined = undefined;

    constructor(unicord: UniCord, options: GenericHandlerOptions, type: DiscordHandlerType) {
        super();

        this.type = type;
        this.options = Object.assign(
            new GenericHandlerOptions(true, undefined),
            options
        );

        if( type == DiscordHandlerType.Event){
            unicord.events = [];
        }else{
            unicord.commands = [];
        }

        if (this.options.autoload) {
            logger.info(`Auto loading all ${type}s from ${this.options.autoload_dir}`);
            this.load_dir = this.options.autoload_dir || "";

            this.autoload(unicord).then(() => {
                this.display_loaded(unicord);
            })
        }
    }

    async autoload(unicord: UniCord) {
        if (!fs.existsSync(this.load_dir)) {
            logger.error(`${this.type}s directory does not exist.`)
            return
        }

        const files = fs
            .readdirSync(this.load_dir)
            .filter((file) => file.endsWith('.js') || file.endsWith('.ts'))

        for (const file of files) {
            const file_path = path.join(this.load_dir, file)

            if(this.type == DiscordHandlerType.Event) {
                const { event } = await import(file_path);
                unicord.events.push(event);

                if(!this.load_event) {
                    continue;
                }

                this.load_event(unicord, event);
            }
        }
    }

    async display_loaded(unicord: UniCord) {
        // TODO: Display also commands if implemented
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