import * as colors from "colors";
import * as fs from "fs";
import { AlignmentEnum, AsciiTable3 } from "ascii-table3";
import { Next, Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import path from "path";
import { Collection } from "discord.js";

export class GenericContext {
  results: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export abstract class GenericTrigger {
  abstract to_ctx: (
    unicord: UniCord,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<GenericContext>;
  abstract from_ctx: (ctx: GenericContext) => Promise<void>;
  abstract get_name: () => string | undefined;
  abstract register(
    unicord: UniCord,
    event: GenericEvent | GenericCommand
  ): void;
  execute: (
    unicord: UniCord,
    event: GenericEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<void> = async (
    unicord: UniCord,
    event: GenericEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => {
    const ctx = await this.to_ctx(unicord, ...args);

    // clonte event.steps as cloned_pipeline.
    const cloned_pipeline = event.steps.clone();

    await cloned_pipeline.push(async (ctx: GenericContext, _next: Next) => {
      this.from_ctx(ctx);
    });

    await cloned_pipeline.execute(ctx);
  };
}

export class GenericEvent {
  triggers: {
    [key: string]: GenericTrigger;
  };
  steps: Pipeline<GenericContext>;

  get_name: () => string | undefined = () => {
    let name: string | undefined;

    Object.values(this.triggers).forEach((trigger: GenericTrigger) => {
      if (trigger.get_name() == undefined) return;

      name = trigger.get_name();
    });

    return name;
  };

  constructor(
    triggers: { [key: string]: GenericTrigger },
    steps: Pipeline<GenericContext>
  ) {
    this.triggers = triggers;
    this.steps = steps;
  }
}

export class GenericCommand extends GenericEvent {
  name: string;
  description: string;

  constructor(
    name: string,
    description: string,
    triggers: { [key: string]: GenericTrigger },
    steps: Pipeline<GenericContext>
  ) {
    super(triggers, steps);
    this.name = name;
    this.description = description;
  }
}

export class UniCord {
  public events: Collection<string, GenericEvent> = new Collection();
  public commands: Collection<string, GenericCommand> = new Collection();
  private init_procedures: Array<(uniCord: UniCord) => void> = [];

  // For slack and discord.js clients
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  public addEvent(event: GenericEvent): void {
    this.events.set(event.get_name() || "", event);
  }

  public addCommand(command: GenericCommand): void {
    this.commands.set(command.get_name() || "", command);
  }

  public init(procedure: (uniCord: UniCord) => void): void {
    this.init_procedures.push(procedure);
  }

  public run(): void {
    this.init_procedures.forEach((procedure) => procedure(this));
  }

  public displayEvents() {
    this.display(this.events.values());
  }

  public displayCommands() {
    this.display(this.commands.values());
  }

  private display(items: IterableIterator<GenericEvent>): void {
    const table = new AsciiTable3("Loaded")
      .setHeading("#", "Name", "Status")
      .setAlign(3, AlignmentEnum.CENTER);

    let i = 1;
    for (const e of items) {
      table.addRowMatrix([[i, e.get_name() || "", colors.green("ok")]]);
      i++;
    }

    console.log(table.toString());
  }
}

export class GenericHandlerOptions {
  autoload: boolean;
  autoload_dir: string;

  constructor(autoload: boolean, autoload_dir: string) {
    this.autoload = autoload;
    this.autoload_dir = autoload_dir;
  }
}

export class GenericHandler {
  load_dir: string = "";
  options: GenericHandlerOptions;

  constructor(
    unicord: UniCord,
    options: GenericHandlerOptions,
    callback: () => void
  ) {
    this.options = Object.assign(new GenericHandlerOptions(true, ""), options);

    if (this.options.autoload) {
      logger.info(`Loading all from ${this.options.autoload_dir}`);
      this.load_dir = this.options.autoload_dir;

      this.autoload(unicord).then(callback);
    }
  }

  async autoload(unicord: UniCord) {
    if (!fs.existsSync(this.load_dir)) {
      logger.error(`${this.load_dir} does not exist.`);
      return;
    }

    const files = fs
      .readdirSync(this.load_dir)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of files) {
      const file_path = path.join(this.load_dir, file);

      const { event, command } = await import(file_path);

      if (event) {
        unicord.addEvent(event);
      } else if (command) {
        unicord.addCommand(command);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values((event || command).triggers).forEach((trigger: any) => {
        trigger.register(unicord, event || command);
      });
    }
  }
}
