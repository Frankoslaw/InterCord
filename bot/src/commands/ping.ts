// import { SlashCommandBuilder } from "discord.js";
// import { UniversalCommand, UniversalContext } from "../handlers/generic_handler";
// import { Next, Pipeline } from "../utils/pipeline";
// import { DiscordCommand } from "../handlers/command_discord";


// export const data: UniversalCommand = {
//     name: "ping",
//     description: "Test ping command using UniCord",
//     handlers: [
//         new DiscordCommand (
//             new SlashCommandBuilder()
//                 .setName("ping")
//                 .setDescription("Replies with Pong!")
//         )
//     ],
//     steps: Pipeline<UniversalContext>(
//         ping_ex
//     )
// }

// function ping_ex(ctx: UniversalContext, next: Next) {
//     ctx.results.push("Pong!");
//     ctx.results.push("Multiple responses test!");

//     next()
// }
