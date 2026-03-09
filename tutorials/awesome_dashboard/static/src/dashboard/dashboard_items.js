/** @odoo-module **/

import { registry } from "@web/core/registry";
import { NumberCard } from "./number_card/number_card";
import { PieChartCard } from "./pie_chart_card/pie_chart_card";

const dashboardRegistry = registry.category("awesome_dashboard");

dashboardRegistry.add("new_orders", {
    id: "new_orders",
    description: "Number of new orders this month",
    Component: NumberCard,
    props: (data) => ({
        title: "New orders this month",
        value: data.nb_new_orders || 0,
    }),
});

dashboardRegistry.add("total_amount", {
    id: "total_amount",
    description: "Total amount of new orders this month",
    Component: NumberCard,
    props: (data) => ({
        title: "Total amount",
        value: data.total_amount || 0,
    }),
});

dashboardRegistry.add("average_quantity", {
    id: "average_quantity",
    description: "Average amount of t-shirt by order this month",
    Component: NumberCard,
    props: (data) => ({
        title: "Average quantity",
        value: data.average_quantity || 0,
    }),
});

dashboardRegistry.add("cancelled_orders", {
    id: "cancelled_orders",
    description: "Number of cancelled orders this month",
    Component: NumberCard,
    props: (data) => ({
        title: "Cancelled orders",
        value: data.nb_cancelled_orders || 0,
    }),
});

dashboardRegistry.add("average_time", {
    id: "average_time",
    description: "Average time for an order to go from 'new' to 'sent' or 'cancelled'",
    Component: NumberCard,
    props: (data) => ({
        title: "Average time (hours)",
        value: data.average_time || 0,
    }),
});

dashboardRegistry.add("orders_by_size", {
    id: "orders_by_size",
    description: "Orders by size",
    Component: PieChartCard,
    size: 2,
    props: (data) => ({
        title: "Orders by size",
        data: data.orders_by_size || {},
    }),
});
