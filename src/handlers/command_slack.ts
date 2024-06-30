import { Interaction, SlashCommandBuilder } from "discord.js";
import {
  GenericCommand,
  GenericContext,
  GenericTrigger,
  UniCord,
} from "./generic_handler";
import { logger } from "@utils/logger";

export class SlackCommandTrigger extends GenericTrigger {
  name: string;
  register(unicord: UniCord, event: GenericCommand): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unicord.slack_client.message(this.name, async ({ command, say }: any) => {
      try {
        this.execute(unicord, event, command, say);
      } catch (error) {
        logger.error("err");
        logger.error(error);
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to_ctx: (unicord: UniCord, ...args: any[]) => Promise<GenericContext>;
  from_ctx: (ctx: GenericContext) => Promise<void>;
  get_name = () => {
    return this.name;
  };

  constructor(
    name: string,
    to_ctx: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((unicord: UniCord, ...args: any[]) => Promise<GenericContext>)
      | undefined = undefined,
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
  ) {
    super();

    this.name = name;
    this.to_ctx = to_ctx || default_to_ctx;
    this.from_ctx = from_ctx || default_from_ctx;
  }
}

const default_to_ctx = async (unicord: UniCord, command: any, say: any) => {
  const ctx = new GenericContext();

  ctx.unicord = unicord;
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
