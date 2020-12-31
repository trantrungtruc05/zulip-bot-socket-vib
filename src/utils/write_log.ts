import logger from "./logger";

export let info = (messages: String) => {
    logger.info(messages);
};

export let error = (messages: String) => {
    logger.error(messages);
};