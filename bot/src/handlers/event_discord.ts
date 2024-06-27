import { logger } from "@utils/logger"
import { Client, Collection, Events } from "discord.js";
import path from "path";
import * as fs from "fs";
import { sTinesClient } from "discord/main";

export enum DiscordTriggerType {
    On = "On",
    Once = "Once"
}

export class DiscordEvent {
    name: Events;
    type: DiscordTriggerType;
    execute: ((...args: any[]) => Promise<void>);

    constructor(name: Events, type: DiscordTriggerType, execute: ((client: Client) => Promise<void>)) {
        this.name = name;
        this.type = type;
        this.execute = execute;
    }
}

export class DiscordEventHandler {
    client: sTinesClient;

    constructor(client: sTinesClient) {
        this.client = client;
        client.events = new Collection();

        this.load_events();
    }

    async load_events() {
        const events_dir = path.join(__dirname +  "/../discord/events")

        if(!fs.existsSync(events_dir)) {
            logger.error('Events directory does not exist.')
            return
        }

        const event_files = fs
            .readdirSync(events_dir)
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))

        for (const file of event_files) {
            const file_path = path.join(events_dir, file)
            const { event }: { event: DiscordEvent } = await import(file_path);
            const event_name: string = event.name

            this.client.events?.set(event_name, event);

            if (event.type == DiscordTriggerType.Once) {
                this.client.once(event_name, (...args) => event.execute(...args))
            }
        }
    }
}
