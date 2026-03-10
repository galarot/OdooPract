/** @odoo-module **/
import { registry } from "@web/core/registry";
import { ClickerModel } from "./clicker_model";

const clickerService = {
    start(env) {
        return new ClickerModel();
    },
};

// Registramos el servicio
registry.category("services").add("awesome_clicker.clicker_service", clickerService);