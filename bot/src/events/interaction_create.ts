import { Events, Interaction } from "discord.js";
import { Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import { GenericCommand, GenericContext, GenericEvent, UniCord } from "handlers/generic_handler";
import { DiscordEventTrigger, DiscordEventType } from "handlers/event_discord";


export const event = new GenericEvent(
    {
        discord_trigger: new DiscordEventTrigger (
            Events.InteractionCreate,
            DiscordEventType.On,
            async (unicord: UniCord, interaction: Interaction) => {
                let ctx = new GenericContext();

                ctx.unicord = unicord;
                ctx.interaction = interaction;

                return ctx;
            },
            async (ctx: GenericContext) => {}
        ),
    },
    Pipeline<GenericContext>(
        (_ctx, next) => {
            logger.info("Someone interacted with the bot");
            next()
        },
        (ctx, next) => {
            ctx.unicord.commands.forEach(async (command: GenericCommand) => {
                if(command.name != ctx.interaction.commandName) {
                    return;
                }

                logger.info("Found command: " + command.name)

                const trigger = event.triggers?.discord_trigger as DiscordEventTrigger;

                if(!trigger) {
                    return;
                }

                // TODO: Fix this naming scheme
                let ctx2 = new GenericContext();
                if( trigger.to_ctx ){
                    ctx2 = await trigger.to_ctx(ctx.unicord, ctx.interaction);
                }

                let pipeline = Object.assign({}, command.steps)
                await pipeline.push(async (ctx3: any, _next: any) => {
                    if( !trigger.from_ctx ){
                        return;
                    }

                    trigger.from_ctx(ctx3)
                })

                command.steps.execute(ctx2)
            })

            next();
        }
    )
)

// const execute = async (...args: any[]) => {
//     let ctx= new GenericContext();
//     if( trigger.to_ctx ){
//         ctx = await trigger.to_ctx(...args);
//     }

//     let pipeline = Object.assign({}, command.steps)
//     await pipeline.push(async (ctx: any, _next: any) => {
//         if( !trigger.from_ctx ){
//             return;
//         }

//         trigger.from_ctx(ctx)
//     })

//     command.steps.execute(ctx)
// }
