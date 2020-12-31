import {transports, createLogger, format} from "winston";

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new (transports.File)({ filename: "zulip-bot.log", level: "info", maxsize: 10000000}),
        new (transports.File)({ filename: "zulip-bot_error.log", level: "error", maxsize: 10000000}),
    ]
});


export default logger;

