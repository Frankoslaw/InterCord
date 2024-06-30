import {
  GenericCommand,
  GenericContext,
  GenericTrigger,
  InterCord,
} from "./generic_handler";
import { logger } from "@utils/logger";

export class SlackCommandTrigger extends GenericTrigger {
  name: string;
  legacy_enabled: boolean = false;
  register(intercord: InterCord, event: GenericCommand): void {
    if (this.legacy_enabled) {
      intercord.slack_client.message(
        this.name,
        async ({ command, say }: any) => {
          try {
            this.execute(intercord, event, command, say);
          } catch (error) {
            logger.error("err");
            logger.error(error);
          }
        }
      );
    } else {
      intercord.slack_client.command(
        "/" + this.name,
        async ({ command, ack, respond }: any) => {
          try {
            this.execute(intercord, event, command, ack, respond);
          } catch (error) {
            logger.error("err");
            logger.error(error);
          }
        }
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to_ctx: (intercord: InterCord, ...args: any[]) => Promise<GenericContext>;
  from_ctx: (ctx: GenericContext) => Promise<void>;
  get_name = () => {
    return this.name;
  };

  constructor(
    name: string,
    legacy_enabled: boolean,
    to_ctx: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((intercord: InterCord, ...args: any[]) => Promise<GenericContext>)
      | undefined = undefined,
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
  ) {
    super();

    this.name = name;
    this.legacy_enabled = legacy_enabled;
    this.to_ctx =
      to_ctx ||
      (this.legacy_enabled ? default_legacy_to_ctx : default_slash_to_ctx);
    this.from_ctx =
      from_ctx ||
      (this.legacy_enabled ? default_legacy_from_ctx : default_slash_from_ctx);
  }
}

const default_legacy_to_ctx = async (
  intercord: InterCord,
  command: any,
  say: any
) => {
  const ctx = new GenericContext();

  ctx.intercord = intercord;
  ctx.command = command;
  ctx.say = say;

  return ctx;
};

const default_slash_to_ctx = async (
  intercord: InterCord,
  command: any,
  ack: any,
  respond: any
) => {
  const ctx = new GenericContext();

  ctx.intercord = intercord;
  ctx.command = command;
  ctx.ack = ack;
  ctx.respond = respond;

  return ctx;
};

const default_legacy_from_ctx = async (ctx: GenericContext) => {
  let full_response = "";
  ctx.results.forEach(async (result: string) => {
    full_response += result + "\n";
  });

  if (full_response != "") {
    await ctx.say(full_response);
  }
};

const default_slash_from_ctx = async (ctx: GenericContext) => {
  await ctx.ack();

  let full_response = "";
  ctx.results.forEach(async (result: string) => {
    full_response += result + "\n";
  });

  if (full_response != "") {
    await ctx.respond(full_response);
  }
};
