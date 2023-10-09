import { Logstash } from "./logstash";

export class ConsoleLog {

    /**
     * @var { Logstash } 
     * instance
     */
    logstash = null;

    constructor(params) {
        this.params = params;
        if (params.logstash) {
            const settings = params.logstash;
            //todo: handle attribute existance

            this.logstash = Logstash.build({
                host: settings.host,
                port: settings.port
            });
        }
        this.#init();
    }

    /**
     * Main purpose is to override
     */
    #init() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originDebug = console.debug;

        const handleLog = (fn, args) => {
            if (!["info", "error", "warn", "debug"].includes(fn)) {
                throw new Error("Invalid fn value, Only ['info', 'error', 'warn', 'debug'] are allowed")
            }

            try {
                if (this.logstash) {
                    this.logstash[fn](args)
                        .then((res) => {
                            //originalLog(res);
                        })
                        .catch((error) => {
                            //originalError(error);
                        });
                    if (this.params && this.params.keepLegacy && this.params.keepLegacy === true) {
                        if (fn === "info") {
                            originalLog.log(args);
                        } else if (fn == "error") {
                            originalError(args);
                        } else if (fn === "warn") {
                            originalWarn(args);
                        } else if (fn === "debug") {
                            originDebug(args);
                        } else {
                            throw new Error("No function defined");
                        }
                    }
                } else {
                    originalLog("No logstash")
                }
            } catch (error) {
                originalError(error.message);
            }
        }

        console.log = (args) => handleLog('info', args);
        console.error = (args) => handleLog('error', args);
        console.warn = (args) => handleLog('warn', args);
        console.debug = (args) => handleLog('debug', args);

        originalLog("Init");
    }

    static build(params) {
        const consoleLog = new ConsoleLog(params);
        return consoleLog;
    }
}