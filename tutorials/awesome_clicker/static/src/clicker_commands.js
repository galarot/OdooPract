/** @odoo-module **/
import { registry } from "@web/core/registry";
import { _t } from "@web/core/l10n/translation";

console.log("Registrando Provider de comandos...");

registry.category("command_provider").add("clicker_provider", {
    provide: (env, options) => {
        const result = [];
        const searchValue = options.searchValue.toLowerCase();

        const openName = _t("Open Clicker Game");
        if (openName.toLowerCase().includes(searchValue)) {
            result.push({
                name: openName,
                action: () => {
                    env.services.action.doAction("awesome_clicker.clicker");
                },
                category: "apps",
            });
        }

        const buyName = _t("Buy 1 Click Bot");
        if (buyName.toLowerCase().includes(searchValue)) {
            result.push({
                name: buyName,
                action: () => {
                    const clicker = env.services["awesome_clicker.clicker_service"];
                    if (clicker && clicker.clicks >= 1000) {
                        clicker.buyClickBot();
                    } else {
                        env.services.notification.add(_t("Not enough clicks!"), {
                            type: "danger",
                        });
                    }
                },
                category: "apps",
            });
        }

        return result;
    },
});