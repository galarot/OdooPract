/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { DashboardConfigDialog } from "./dashboard_config_dialog";

class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem };

    setup() {
        this.action = useService("action");
        this.dialog = useService("dialog");
        this.statistics = useState(useService("awesome_dashboard.statistics"));
        
        this.state = useState({
            hiddenItems: this.loadHiddenItems(),
        });

        this.display = {
            controlPanel: {
                "top-right": false,
                "bottom-right": false,
            },
        };
    }

    get items() {
        const itemsRegistry = registry.category("awesome_dashboard");
        const allItems = itemsRegistry.getAll();
        return allItems.filter(item => !this.state.hiddenItems.includes(item.id));
    }

    loadHiddenItems() {
        const stored = localStorage.getItem("awesome_dashboard.hiddenItems");
        return stored ? JSON.parse(stored) : [];
    }

    saveHiddenItems(hiddenItems) {
        this.state.hiddenItems = hiddenItems;
        localStorage.setItem("awesome_dashboard.hiddenItems", JSON.stringify(hiddenItems));
    }

    openCustomers() {
        this.action.doAction("base.action_partner_form");
    }

    openLeads() {
        this.action.doAction({
            type: "ir.actions.act_window",
            name: "Leads",
            res_model: "crm.lead",
            views: [[false, "list"], [false, "form"]],
        });
    }

    openConfiguration() {
        const allItems = registry.category("awesome_dashboard").getAll();
        this.dialog.add(DashboardConfigDialog, {
            items: allItems,
            hiddenItems: this.state.hiddenItems,
            save: (hiddenItems) => this.saveHiddenItems(hiddenItems),
        });
    }
}

registry.category("lazy_components").add("awesome_dashboard.dashboard", AwesomeDashboard);
