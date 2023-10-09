const { ConsoleLog } = require("../lib/index");

// translate `main.js` to CommonJS
//require = require("esm")(module);
//module.exports = require("./main.js");

const csl = ConsoleLog.build({
    logstash: {
        host: "http://localhost",
        port: 50000
    }
})

describe('Console Log', function () {
    it('Log', async function () {
        this.timeout(10000);

        console.log("API_CONSOLE", "tEST");
    });

    it('Warn', async function () {
        this.timeout(10000);

        console.warn("API_CONSOLE", "tEST");
    });

    it('Error', async function () {
        this.timeout(10000);

        console.error("API_CONSOLE", "tEST");
    });

    it('Debug', async function () {
        this.timeout(10000);

        console.debug("API_CONSOLE", "tEST");
    });
})