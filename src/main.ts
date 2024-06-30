import "module-alias/register";

// UTILS
export { event as default_interaction_create } from "events/interaction_create";
export * from "utils/pipeline";
export * from "utils/logger";

// HANDLER
export * from "handlers/generic_handler";
export * from "handlers/event_discord";
export * from "handlers/command_discord";
export * from "handlers/command_slack";
export * from "handlers/command_express";

// STARTUP CODE
export { discord_client as default_discord_client } from "start/discord";
export { slack_client as default_slack_client } from "start/slack";
export { express_client as default_express_client } from "start/express";
