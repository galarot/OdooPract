/** @odoo-module **/
import { registry } from "@web/core/registry";

const dummyClickerService = {
    start(env) {
        return {
            clicks: 0,
            increment: () => {},
            getReward: () => null,
        };
    },
};

registry.category("services").add("clicker", dummyClickerService);