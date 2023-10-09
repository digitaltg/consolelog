import fetch from 'cross-fetch';

export class Logstash {

    constructor(params) {
        this.host = params.host;
        this.port = params.port;
        this.username = params.username;
        this.password = params.password;

        this.headers = {
            auth: {
                username: this.username,
                password: this.password
            }
        }
    }

    /**
     * 
     * @param {*} args 
     * @returns 
     */
    info(...args) {
        return this.#write("INFO", ...args);
    }

    /**
     * 
     * @param {*} args 
     * @returns 
     */
    warn(...args) {
        return this.#write("WARNING", ...args);
    }

    /**
     * 
     * @param {*} args 
     * @returns 
     */
    error(...args) {
        return this.#write("ERROR", ...args);
    }

    /**
     * 
     * @param {*} args 
     * @returns 
     */
    debug(...args) {
        return this.#write("DEBUG", ...args);
    }

    /**
     * 
     * @param {string} level 
     * @param {*} channel 
     * @param {*} args 
     * @returns 
     */
    #write(level, ...args) {
        const body = JSON.stringify(
            {
                level,
                channel: process.env.CONSOLE_LOG_CHANNEL ? process.env.CONSOLE_LOG_CHANNEL : "CONSOLE_LOG",
                data: args
            }
        );
        return new Promise((resolve, reject) => {
            try {

                fetch(`${this.host}:${this.port}`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application.json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + Buffer.from(this.username + ":" + this.password).toString("base64")
                    },
                    signal: AbortSignal.timeout(1000),
                    body: body
                }).then((res) => {
                    resolve(res);
                }).catch((error) => {
                    reject(error);
                }).finally(() => {
                    resolve(true);
                })
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 
     * @param {{host: string, post: number}} params 
     */
    static build(params) {
        return new Logstash(params);
    }
}