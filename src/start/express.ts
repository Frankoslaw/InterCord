import { config } from "@config";
import { logger } from "@utils/logger";
import express from "express";

const express_client = express();
const port = config.EXPRESS_PORT || 3000;

express_client.listen(port, () => {
  logger.info(`Bot is online( Express + PORT: ${port} ).`);
});

export { express_client };
