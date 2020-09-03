import * as yargs from "yargs";
import {getApp} from "../webserver/server";
import {parseEnv, parseFile} from "../config/server-config";

const options = yargs.usage("Usage: shotput-server.js")
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
let _options = options.configFile ? parseFile(options.configFile) : parseEnv();

const app = getApp(_options);

app.listen(options.port, '0.0.0.0', () => {
    console.log("Serving api on port " + options.port);
});
