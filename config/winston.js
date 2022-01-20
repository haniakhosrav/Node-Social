const Winston = require('winston');
const appRoot = require('app-root-path');

const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExeptions: true,
        format: Winston.format.json(),
        maxsize: 5000000, // 5 MG
        maxfile: 5,
    },

    console: {
        level: 'debug',
        handleExeptions: true,
        format: Winston.format.combine(
            Winston.format.colorize(),
            Winston.format.simple()
        ),
    }
}

const logger = new Winston.createLogger({
    transports: [
        new Winston.transports.File(options.file),
        new Winston.transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message){
        logger.info(message)
    }
}

module.exports = logger;