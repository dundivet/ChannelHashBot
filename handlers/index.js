const handlers = [
    `help`,
    `channelPost`,
    `newMember`,
    `settings`,
    `watch`,
    `unwatch`,
    `tags`,
    `hashtag`,
    `likes`,
    `whitelist`,
];

module.exports = (bot, db) =>
    handlers.forEach(handler => require(`./${handler}`)(bot, db));
