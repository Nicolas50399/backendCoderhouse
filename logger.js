const log4js = require('log4js')

log4js.configure({
    appenders: {
        consola: { type: "console" },
        WarningFile: { type: "file", filename: "./logs/warn.log" },
        ErrorFile: { type: "file", filename: "./logs/error.log" },

        loggerWarnings: {
            appender: "WarningFile",
            type: "logLevelFilter",
            level: "warn"
        },
        loggerErrores: {
            appender: "ErrorFile",
            type: "logLevelFilter",
            level: "error"
        },
        loggerConsola: {
            appender: "consola",
            type: "logLevelFilter",
            level: "info"
        }
    },
    categories: {
        default: {
            appenders: ["consola", "loggerWarnings", "loggerErrores"],
            level: "all"
        }
    }
})

const logger = log4js.getLogger()

module.exports = logger