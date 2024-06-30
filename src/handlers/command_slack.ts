import {
  GenericCommand,
  GenericContext,
  GenericTrigger,
  InterCord,
} from "./generic_handler";
import { logger } from "@utils/logger";

export class SlackCommandTrigger extends GenericTrigger {
  name: string;
  register(intercord: InterCord, event: GenericCommand): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    intercord.slack_client.message(this.name, async ({ command, say }: any) => {
      try {
        this.execute(intercord, event, command, say);
      } catch (error) {
        logger.error("err");
        logger.error(error);
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to_ctx: (intercord: InterCord, ...args: any[]) => Promise<GenericContext>;
  from_ctx: (ctx: GenericContext) => Promise<void>;
  get_name = () => {
    return this.name;
  };

  constructor(
    name: string,
    to_ctx: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((intercord: InterCord, ...args: any[]) => Promise<GenericContext>)
      | undefined = undefined,
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
  ) {
    super();

    this.name = name;
    this.to_ctx = to_ctx || default_to_ctx;
    this.from_ctx = from_ctx || default_from_ctx;
  }
}

const default_to_ctx = async (intercord: InterCord, command: any, say: any) => {
  const ctx = new GenericContext();

  ctx.intercord = intercord;
  ctx.command = command;
  ctx.say = say;

  return ctx;
};

const default_from_ctx = async (ctx: GenericContext) => {
  let full_response = "";
  ctx.results.forEach(async (result: string) => {
    full_response += result + "\n";
  });

  if (full_response != "") {
    await ctx.say(full_response);
  }
};
