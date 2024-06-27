import pino from "pino";

const transports = [{
    target: "pino-pretty",
    options: {
        ignore: "pid,hostname",
        destination: './logs/logs.txt'
    }
}]

const logger = pino(pino.transport({ targets: transports }))

module.exports = logger;
