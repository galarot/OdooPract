/** @odoo-module **/

import { Component, onWillStart, useRef, onMounted } from "@odoo/owl";
import { loadJS } from "@web/core/assets";

export class PieChartCard extends Component {
    static template = "awesome_dashboard.PieChartCard";
    static props = {
        title: String,
        data: Object,
    };

    setup() {
        this.canvasRef = useRef("canvas");
        
        onWillStart(async () => {
            await loadJS("/web/static/lib/Chart/Chart.js");
        });

        onMounted(() => {
            this.renderChart();
        });
    }

    renderChart() {
        const ctx = this.canvasRef.el;
        const labels = Object.keys(this.props.data);
        const data = Object.values(this.props.data);
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: this.props.title,
                    data: data,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                    ],
                }]
            },
        });
    }
}
