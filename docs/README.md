# InterCord

#### Author: Franciszek Łopuszański <!-- {docsify-ignore} -->

**Disclaimer**: The "InterCord" library is currently in its **early alpha** stage and is expected to be **very unstable**. Users should be aware that this version may contain significant bugs and incomplete features. There is no warranty provided with this software, and anyone who chooses to use "InterCord" does so at their own risk. We strongly advise against using this library in production environments or for critical applications at this time.

## Getting Started

"InterCord" is a versatile library designed to provide a uniform way to declare events and commands using middleware, ensuring seamless integration across various platforms. By being platform-agnostic, "InterCord" allows developers to trigger these events and commands regardless of the underlying platform. This design philosophy separates business logic from the trigger implementation, promoting cleaner, more maintainable code and enabling a more modular approach to application development.

Currently supported are these providers:

- Discord using discord.js
- Slack using bolt
- REST using Express

## Installation

Assuming you’ve already installed Node.js, create a directory to hold your application, and make that your working directory. Current release of InterCord was tested with node.js v22 and pnpm, but older releases of node.js should also work as long as they satisfy requirments of these projects:

- https://discord.js.org/
- https://api.slack.com/tools/bolt-js
- https://expressjs.com/en/starter/installing.html

```sh
mkdir mybot
cd mybot
```

Use the npm init command to create a package.json file for your application.

```sh
npm init
```

This command prompts you for a number of things, such as the name and version of your application. Now, install "InterCord" in the mybot directory and save it in the dependencies list. For example:

```sh
npm i @frankoslaw/intercord
```

It is also **advicable** to use **typescript** as the "InterCord" provides complete type definitions which could help during a development cycle.

## Pipelines

Unlike libraries such as discord.js, "InterCord" does not rely on simple singular functions. Instead, it adopts a middleware architecture similar to frameworks like Express.js. When an event or command is triggered, the entire pipeline is executed sequentially, task by task. While this may appear to introduce unnecessary complexity, it facilitates the implementation of universal guards, such as verifying if a user is an administrator. Additionally, this architecture significantly simplifies the decoupling of business logic from custom steps, as they can be easily integrated into the pipeline.

#### Example pipeline for ping command <!-- {docsify-ignore} -->

```ts
Pipeline<GenericContext>(
  (ctx, next) => {
    ctx.results.push("Pong!");

    next();
  },
  (ctx, next) => {
    ctx.results.push("As you can see we can chain them infinitely!");

    next();
  }
);
```

## Triggers

The main type used by "InterCord" is the GenericTrigger. This abstract class cannot be used directly, but understanding its functionality is crucial before examining any specific provider. The GenericTrigger class provides four key methods: to_ctx, from_ctx, execute, and register.

- to_ctx: Converts any platform-specific form, such as an HTTP request or a Discord interaction, into a commonly accepted form that implements the GenericContext class. If left as undefine in the Trigger constructor it will implement default method for specific platform.
- from_ctx: Performs the reverse of to_ctx. It generates a platform-specific response, such as a JSON or message, based on the content of GenericContext after executing the entire pipeline. This method is positioned at the end of the pipeline and will execute automatically unless the next() function is omitted from the last call. While this inhibition is possible, it is not advisable as it would result in an unresponsive command. If left as undefine in the Trigger constructor it will implement default method for specific platform.
- execute: Calls both to_ctx and from_ctx, and executes the entire pipeline. It is triggered by external methods provided by the three frameworks mentioned earlier. For instance, in the case of discord.js, the client.on/once method calls execute when triggering an event.
- register: Contains domain-specific implementations that instruct "InterCord" on how to register specific events or commands and chain the trigger for the execute method.

#### Example triggers for ping command <!-- {docsify-ignore} -->

```ts
discord_trigger: new DiscordCommandTrigger(
    new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
    undefined, // default to_ctx, this argument can also be skipped as the default value is set to undefined
    undefined  // default from_ctx
),
express_trigger: new ExpressCommandTrigger(
    ExpressMethodType.GET,
    "/commands/ping",
    undefined, // default to_ctx
    undefined  // default from_ctx
),
slack_trigger: new SlackCommandTrigger(
    "ping",
    undefined, // default to_ctx
    undefined  // default from_ctx
),
```

## Events

The basic unit of an event in "InterCord" is called GenericEvent. Currently, only the discord_trigger is available for events, but future support for Slack is anticipated. Events consist of two major components: triggers and the pipeline. The workings of triggers were explained in the previous paragraph. The pipeline contains all the steps that should be executed when the trigger is activated.

#### Example event for client_ready(discord) <!-- {docsify-ignore} -->

```ts
import { Events } from "discord.js";
import {
  Pipeline,
  logger,
  GenericContext,
  GenericEvent,
  DiscordEventTrigger,
  DiscordEventType,
} from "@frankoslaw/intercord";

export const event = new GenericEvent(
  {
    discord_trigger: new DiscordEventTrigger(
      Events.ClientReady,
      DiscordEventType.Once
    ),
  },
  Pipeline<GenericContext>((_ctx, next) => {
    logger.info("Bot is online( discord ).");
    next();
  })
);
```

## Commands

The second way to interact with the bot is through commands. Commands encapsulate an event and can be triggered in multiple ways:

- Discord: Through an interaction_create event, which can be found in the src/events folder. This is the only event implemented by default.
- Slack: Through a message event. Currently, this is hardcoded and not managed through an event handler, making it impossible to access basic event parts at present.
- REST: Through GET or POST requests. Due to the nature of Express, there is no need for low-level interactions in the form of events.

#### Example ping command implementation <!-- {docsify-ignore} -->

```ts
import { SlashCommandBuilder } from "discord.js";
import {
  Pipeline,
  GenericCommand,
  GenericContext,
  DiscordCommandTrigger,
  ExpressCommandTrigger,
  ExpressMethodType,
  SlackCommandTrigger,
} from "@frankoslaw/intercord";

export const command = new GenericCommand(
  "ping",
  "Test ping command using UniCord",
  {
    discord_trigger: new DiscordCommandTrigger(
      new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!")
    ),
    express_trigger: new ExpressCommandTrigger(
      ExpressMethodType.GET,
      "/commands/ping"
    ),
    slack_trigger: new SlackCommandTrigger("ping"),
  },
  Pipeline<GenericContext>((ctx, next) => {
    ctx.results.push("Pong!");

    next();
  })
);
```

## Handlers

Handlers are simple pieces of code that load your events and commands from folder and register them on the bot during `bot.start()` procedure. If you want to write your own handler or bypass them it is possible by using `bot.addEvent();` or `bot.addCommand();` methods, but remember such instance is orphaned and will not be automaticly registered by any of the handlers during startup. To register your own instances you will need to call `.register()` on every trigger that you require manually.

#### Example of manual event registaration <!-- {docsify-ignore} -->

```ts
bot.addEvent(default_interaction_create);
Object.values(default_interaction_create.triggers).forEach((trigger: any) => {
  trigger.register(bot, default_interaction_create);
});
```

#### Example of generic handler usage

```ts
const _event_handler = new GenericHandler(
  bot,
  {
    autoload: true,
    autoload_dir: path.join(__dirname + "/events"),
  },
  () => {
    bot.displayEvents();
  }
);
const _command_handler = new GenericHandler(
  bot,
  {
    autoload: true,
    autoload_dir: path.join(__dirname + "/commands"),
  },
  () => {
    bot.displayCommands();
  }
);
```

## Bootstrap

Before any handler can interact with its commands or events, some bootstrapping is required for specific platforms. This typically involves logging into the respective platforms and/or starting a server. "InterCord" provides default implementations of this bootstrapping code in the src/start folder. Alternatively, you can provide your own bootstrapping code and set the `<platform>_client` variable on the main bot class. Remember that this needs to be done before calling `bot.start()`.

#### Example of bootstraping code <!-- {docsify-ignore} -->

```ts
bot.discord_client = default_discord_client;
bot.slack_client = default_slack_client;
bot.express_client = default_express_client;
```

## Config

If you are using default bootstraping code "InterCord" will search for an .env file with such fields:

```toml
# DISCORD
DISCORD_TOKEN=""
DISCORD_CLIENT_ID=""

# SLACK
SLACK_SIGNING_SECRET=""
SLACK_BOT_TOKEN=""
SLACK_APP_TOKEN=""
SLACK_PORT=3000

# Express
EXPRESS_PORT=3000
```

## Example

Full example of code usage can be found here: https://github.com/Frankoslaw/InterCord/tree/main/examples/ping_bot
