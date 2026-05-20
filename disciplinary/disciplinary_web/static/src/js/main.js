/** @odoo-module **/
import { mount, whenReady } from "@odoo/owl";
import { DisciplinaryApp } from "./disciplinary_form";
import { templates } from "@web/core/assets";

whenReady(() => {
    const root = document.querySelector("#disciplinary_app_root");
    if (root) {
        const props = JSON.parse(root.dataset.props || "{}");
        // Eliminar el placeholder de carga inmediatamente antes de montar
        const placeholder = root.querySelector("#owl_loading_placeholder");
        if (placeholder) {
            placeholder.remove();
        }
        mount(DisciplinaryApp, root, {
            templates,
            props,
            dev: true,
        });
    }
});