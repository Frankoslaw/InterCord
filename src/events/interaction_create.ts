import { Events, Interaction } from "discord.js";
import { Pipeline } from "../utils/pipeline";
import {
  GenericCommand,
  GenericContext,
  GenericEvent,
  InterCord,
} from "handlers/generic_handler";
import { DiscordEventTrigger, DiscordEventType } from "handlers/event_discord";

export const event = new GenericEvent(
  {
    discord_trigger: new DiscordEventTrigger(
      Events.InteractionCreate,
      DiscordEventType.On,
      async (intercord: InterCord, interaction: Interaction) => {
        const ctx = new GenericContext();

        ctx.intercord = intercord;
        ctx.interaction = interaction;

        return ctx;
      },
      async (_ctx: GenericContext) => {}
    ),
  },
  Pipeline<GenericContext>((ctx, next) => {
    const command = ctx.intercord.commands.get(
      ctx.interaction.commandName
    ) as GenericCommand;

    if (!command) return;

    const trigger = command.triggers?.discord_trigger as DiscordEventTrigger;

    if (!trigger) return;

    trigger.execute(ctx.intercord, command, ctx.interaction);
    next();
  })
);
