import * as yargs from "yargs";
import {getApp} from "../webserver/server";
import {applyEnvironmentVars, parseFile} from "../config/server-config";

const options = yargs.usage("Usage: cli.js")
    .options({
        'port': {
            type: "number",
            default: 3000
        },
        "configFile": {
            type: "string"
        }
    }).argv;

// @ts-ignore
let _options = options.configFile ? parseFile(options.configFile) : applyEnvironmentVars(options);

const app = getApp(_options);

app.listen(options.port, "127.0.0.1", () => {
    console.log("Serving api on port " + options.port);
});
