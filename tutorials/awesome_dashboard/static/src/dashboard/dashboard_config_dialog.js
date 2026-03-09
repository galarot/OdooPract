/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class DashboardConfigDialog extends Component {
    static template = "awesome_dashboard.DashboardConfigDialog";
    static props = {
        items: Array,
        hiddenItems: Array,
        close: Function,
        save: Function,
    };

    setup() {
        this.state = useState({
            hiddenItems: [...this.props.hiddenItems],
        });
    }

    toggleItem(itemId) {
        const index = this.state.hiddenItems.indexOf(itemId);
        if (index >= 0) {
            this.state.hiddenItems.splice(index, 1);
        } else {
            this.state.hiddenItems.push(itemId);
        }
    }

    isChecked(itemId) {
        return !this.state.hiddenItems.includes(itemId);
    }

    apply() {
        this.props.save(this.state.hiddenItems);
        this.props.close();
    }
}
