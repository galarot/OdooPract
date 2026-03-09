/** @odoo-module **/

import { registry } from "@web/core/registry";
import { reactive } from "@odoo/owl";

export const statisticsService = {
    dependencies: ["rpc"],
    
    start(env, { rpc }) {
        const statistics = reactive({});
        
        async function loadStatistics() {
            const data = await rpc("/awesome_dashboard/statistics");
            Object.assign(statistics, data);
        }
        
        // Load initial data
        loadStatistics();
        
        // Reload every 10 minutes (600000ms)
        setInterval(loadStatistics, 600000);
        
        return statistics;
    },
};

registry.category("services").add("awesome_dashboard.statistics", statisticsService);
