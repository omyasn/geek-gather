import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App.js";

console.log('!!!!!CLIENT!!!!!!!!!!!!!!');
ReactDOM.hydrate(<App />, document.getElementById("root"));