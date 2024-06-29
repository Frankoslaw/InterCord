/* eslint-disable @typescript-eslint/no-explicit-any */
import { Events } from "discord.js";
import {
  GenericContext,
  GenericEvent,
  GenericTrigger,
  UniCord,
} from "./generic_handler";

export enum DiscordEventType {
  On = "On",
  Once = "Once",
}

export class DiscordEventTrigger extends GenericTrigger {
  name: Events;
  type: DiscordEventType;
  register(unicord: UniCord, event: GenericEvent): void {
    if (this.type == DiscordEventType.Once) {
      unicord.discord_client.once(this.name, (...args: any[]) =>
        this.execute(unicord, event, ...args),
      );
    } else {
      unicord.discord_client.on(this.name, (...args: any[]) =>
        this.execute(unicord, event, ...args),
      );
    }
  }
  to_ctx: (unicord: UniCord, ...args: any[]) => Promise<GenericContext>;
  from_ctx: (ctx: GenericContext) => Promise<void>;
  get_name = () => {
    return this.name;
  };

  constructor(
    event: Events,
    type: DiscordEventType,
    to_ctx:
      | ((unicord: UniCord, ...args: any[]) => Promise<GenericContext>)
      | undefined = undefined,
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined,
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

const default_to_ctx = async (unicord: UniCord) => {
  const ctx = new GenericContext();

  ctx.unicord = unicord;

  return ctx;
};
