import { createLogger, transports, format, Logger }  from  'winston';

/*
* @author Prafful Bansal
* @description logger for logging events 
*/
const logger: Logger = createLogger({
    transports: [   
    new transports.Console({
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    )
    }),

    new transports.File({
        dirname: "logs",
        filename: "express.log",
        format : format.combine(format.json())
    }),
    ],
    format: format.combine(format.metadata(), format.timestamp())
})

export default logger;