/** @odoo-module **/
import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { useExternalListener } from "@odoo/owl";
import { useState } from "@odoo/owl";

export class ClickerSystray extends Component {
    static template = "awesome_clicker.ClickerSystray";

    setup() {
        this.action = useService("action");

        // Obtenemos el servicio. Al ser una instancia de Reactive, 
        // usamos useState para que el Systray se repinte automáticamente al cambiar los clics.
        const service = useService("awesome_clicker.clicker_service");
        this.clicker = useState(service);

        // Escucha global de clics en toda la página
        useExternalListener(document.body, "click", () => {
            this.clicker.increment(1);
        }, { capture: true });
    }

    // Método para incrementar desde el botón "+"
    increment(ev) {
        ev.stopPropagation();
        this.clicker.increment(10);
    }

    // Método para abrir el Dashboard del juego
    openClientAction() {
        this.action.doAction({
            type: "ir.actions.client",
            tag: "awesome_clicker.clicker",
            target: "new",
            name: "Clicker Game"
        });
    }
}

// Registro en el Systray
export const systrayItem = { Component: ClickerSystray };
registry.category("systray").add("awesome_clicker.ClickerSystray", systrayItem, { sequence: 100 });