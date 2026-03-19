/** @odoo-module **/

import { visitXML } from "@web/core/utils/xml";
import { App } from "@odoo/owl";

let tooltipTemplateCounter = 1;

export class GalleryArchParser {
    parse(xmlDoc) {
        const imageField = xmlDoc.getAttribute("image_field");
        const tooltipField = xmlDoc.getAttribute("tooltip_field");
        const fieldNames = [];
        let tooltipTemplate = null;

        visitXML(xmlDoc, (node) => {
            if (node.tagName === "field") {
                const name = node.getAttribute("name");
                if (name) fieldNames.push(name);
            }
            if (node.tagName === "tooltip-template") {
                // Replace <field name="x"/> with <t t-esc="record['x']"/>
                for (const field of [...node.querySelectorAll("field")]) {
                    const tEsc = document.createElement("t");
                    tEsc.setAttribute("t-esc", `record['${field.getAttribute("name")}']`);
                    field.replaceWith(tEsc);
                }
                const templateName = `awesome_gallery.tooltip_${tooltipTemplateCounter++}`;
                const parser = new DOMParser();
                const templateDoc = parser.parseFromString(
                    `<t t-name="${templateName}">${node.innerHTML}</t>`,
                    "text/xml"
                );
                const templateEl = templateDoc.documentElement;
                App.registerTemplate(templateName, templateEl);
                tooltipTemplate = templateName;
            }
        });

        return {
            imageField,
            tooltipField,
            fieldNames,
            tooltipTemplate,
        };
    }
}
