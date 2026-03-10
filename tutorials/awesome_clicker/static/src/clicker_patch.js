/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { FormController } from "@web/views/form/form_controller";
import { useService } from "@web/core/utils/hooks";

patch(FormController.prototype, {
    setup() {
        super.setup();
        this.notification = useService("notification");
        this.action = useService("action");
        this.clicker = useService("clicker");

        if (Math.random() < 0.9) {
            const reward = this.clicker.getReward();
            if (reward) {
                this.notification.add(`¡Has encontrado un premio! ${reward.description}`, {
                    type: "info",
                    sticky: true,
                    buttons: [{
                        name: "Collect",
                        onClick: () => {
                            reward.apply(this.clicker);
                            this.action.doAction("awesome_clicker.clicker");
                        },
                    }],
                });
            }
        }
    },
});