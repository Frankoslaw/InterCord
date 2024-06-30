import { Interaction, SlashCommandBuilder } from "discord.js";
import {
  GenericCommand,
  GenericContext,
  GenericTrigger,
  InterCord,
} from "./generic_handler";

export class DiscordCommandTrigger extends GenericTrigger {
  slash: SlashCommandBuilder;
  register(_intercord: InterCord, _event: GenericCommand): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to_ctx: (intercord: InterCord, ...args: any[]) => Promise<GenericContext>;
  from_ctx: (ctx: GenericContext) => Promise<void>;
  get_name = () => {
    return this.slash.name;
  };

  constructor(
    slash: SlashCommandBuilder,
    to_ctx: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((intercord: InterCord, ...args: any[]) => Promise<GenericContext>)
      | undefined = undefined,
    from_ctx: ((ctx: GenericContext) => Promise<void>) | undefined = undefined
  ) {
    super();

    this.slash = slash;
    this.to_ctx = to_ctx || default_to_ctx;
    this.from_ctx = from_ctx || default_from_ctx;
  }
}

const default_to_ctx = async (
  intercord: InterCord,
  interaction: Interaction
) => {
  const ctx = new GenericContext();

  ctx.intercord = intercord;
  ctx.interaction = interaction;

  return ctx;
};

const default_from_ctx = async (ctx: GenericContext) => {
  let full_response = "";
  ctx.results.forEach(async (result: string) => {
    full_response += result + "\n";
  });

  if (full_response != "") {
    await ctx.interaction.reply(full_response);
  }
};
