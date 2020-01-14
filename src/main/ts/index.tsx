import "../scss/main.scss";
import "../templates/index.html";
import * as ReactDOM from "react-dom";
import * as React from "react";
import {MAIN_ID} from "./constants";
import {App} from "../App";

window.addEventListener("DOMContentLoaded", () => {
    const tabHolder = document.createElement("div");
    tabHolder.id = MAIN_ID;
    document.body.appendChild(tabHolder);

    ReactDOM.render(<App/>, tabHolder);
});