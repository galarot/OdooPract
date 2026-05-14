/** @odoo-module **/

import { Component, status } from "@odoo/owl";
import { Autobaremo } from "./components/autobaremo";

export class Playground extends Component {
  static template = "awesome_owl.playground";
  static components = { Autobaremo };

}
