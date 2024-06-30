/* eslint-disable @typescript-eslint/no-explicit-any */
import { Events } from "discord.js";
import {
  GenericContext,
  GenericEvent,
  GenericTrigger,
  InterCord,
} from "./generic_handler";

export enum DiscordEventType {
  On = "On",
  Once = "Once",
}

export class DiscordEventTrigger extends GenericTrigger {
  name: Events;
  type: DiscordEventType;
  register(intercord: InterCord, event: GenericEvent): void {
    if (this.type == DiscordEventType.Once) {
      intercord.discord_client.once(this.name, (...args: any[]) =>
        this.execute(intercord, event, ...args)
      );
    } else {
      intercord.discord_client.on(this.name, (...args: any[]) =>
        this.execute(intercord, event, ...args)
      );
    }
  }
  to_ctx: (intercord: InterCord, ...args: any[]) => Promise<GenericContext>;
  from_ctx: (ctx: GenericContext) => Promise<void>;
  get_name = () => {
    return this.name;
  };

  constructor(
    event: Events,
    type: DiscordEventType,
    to_ctx:
      | ((intercord: InterCord, ...args: any[]) => Promise<GenericContext>)
      | undefined = undefined,
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
  ) {
    super();

    this.name = event;
    this.type = type;
    this.to_ctx = to_ctx || default_to_ctx;
    this.from_ctx =
      from_ctx ||
      (async () => {
        return;
      });
  }
}

const default_to_ctx = async (intercord: InterCord) => {
  const ctx = new GenericContext();

  ctx.intercord = intercord;

  return ctx;
};
