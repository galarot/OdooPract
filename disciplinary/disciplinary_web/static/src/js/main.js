/** @odoo-module **/
import { mount, whenReady } from "@odoo/owl";
import { DisciplinaryApp } from "./disciplinary_form";
import { templates } from "@web/core/assets";

whenReady(() => {
    const root = document.querySelector("#disciplinary_app_root");
    if (root) {
        const props = JSON.parse(root.dataset.props || "{}");
        mount(DisciplinaryApp, root, {
            templates,
            props,
            dev: true,
        });
    }
});