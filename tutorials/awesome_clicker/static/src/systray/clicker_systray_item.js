/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useExternalListener, useState } from "@odoo/owl";
import { Dropdown } from "@web/core/dropdown/dropdown";
import { DropdownItem } from "@web/core/dropdown/dropdown_item";

export class ClickerSystray extends Component {
    static template = "awesome_clicker.ClickerSystray";
    static components = { Dropdown, DropdownItem };

    setup() {
        this.action = useService("action");
        const service = useService("awesome_clicker.clicker_service");
        this.clicker = useState(service);

        useExternalListener(document.body, "click", () => {
            this.clicker.increment(1);
        }, { capture: true });
    }

    increment(ev) {
        ev.stopPropagation();
        this.clicker.increment(10);
    }

    openClientAction() {
        this.action.doAction({
            type: "ir.actions.client",
            tag: "awesome_clicker.clicker",
            target: "new",
            name: "Clicker Game"
        });
    }

    buyClickBot() {
        this.clicker.buyClickBot();
    }
}

export const systrayItem = { Component: ClickerSystray };
registry.category("systray").add("awesome_clicker.ClickerSystray", systrayItem, { sequence: 100 });