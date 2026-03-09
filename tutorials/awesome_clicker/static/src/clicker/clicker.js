/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class AwesomeClicker extends Component {
    static template = "awesome_clicker.AwesomeClicker";
}

registry.category("actions").add("awesome_clicker.clicker", AwesomeClicker);