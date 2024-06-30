import { logger } from "@utils/logger";
import express, { Request, Response } from "express";

const express_client = express();
const port = 3000;

express_client.listen(port, () => {
  logger.info(`Bot is online( Express + PORT: ${port} ).`);
});

export { express_client };
