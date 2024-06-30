import pino from "pino";

const transports = [
  {
    target: "pino-pretty",
    options: {
      ignore: "pid,hostname",
      // destination: './logs/logs.txt'
    },
  },
];

export const logger = pino(pino.transport({ targets: transports }));
