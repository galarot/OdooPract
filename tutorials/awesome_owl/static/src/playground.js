/** @odoo-module **/

import { Component, useState, markup } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Counter } from "./counter/counter";
import { Card } from "./card/card";
import { TodoList } from "./todo_list/todo_list";

export class Playground extends Component {
    static template = "awesome_owl.playground";
    static components = { Counter, Card, TodoList };

    setup() {
        this.state = useState({ sum: 0 });
        this.html = markup("<div>some <b>html</b> content</div>");
    }

    incrementSum() {
        this.state.sum++;
    }
}

registry.category("actions").add("owl.playground", Playground);