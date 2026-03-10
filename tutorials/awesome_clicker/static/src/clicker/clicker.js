/** @odoo-module **/
import { Component, onWillDestroy } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useClicker } from "../clicker_hook";
import { useService } from "@web/core/utils/hooks";

export class AwesomeClicker extends Component {
    static template = "awesome_clicker.AwesomeClicker";

    setup() {
        this.clicker = useClicker();
        this.notification = useService("notification");

        const onMilestone = () => {
            this.notification.add("¡Has alcanzado un nuevo nivel!", {
                type: "success",
                title: "Hito alcanzado",
                sticky: false,
                duration: 3000,
            });
        };

        const onReward = (ev) => {
            this.notification.add(`¡Recompensa! ${ev.detail.description}`, {
                type: "info",
                title: "Bonus",
                sticky: false,
                duration: 3000,
            });
        };


        this.clicker.bus.addEventListener("MILESTONE_REACHED", onMilestone);
        this.clicker.bus.addEventListener("REWARD_RECEIVED", onReward);


        onWillDestroy(() => {
            this.clicker.bus.removeEventListener("MILESTONE_REACHED", onMilestone);
            this.clicker.bus.removeEventListener("REWARD_RECEIVED", onReward);
        });
    }
}

registry.category("actions").add("awesome_clicker.clicker", AwesomeClicker);