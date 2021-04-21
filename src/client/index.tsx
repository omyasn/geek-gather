import * as React from "react";
import { hydrate } from "react-dom";
import BasePage from './BasePage';

console.log('CLIENT!');
hydrate(<BasePage><h1>l</h1></BasePage>, document.getElementById("root"));