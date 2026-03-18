/** @odoo-module **/
import { registry } from "@web/core/registry";
import { GalleryController } from "./gallery_controller";
import { GalleryArchParser } from "./gallery_arch_parser";
import { GalleryModel } from "./gallery_model";
import { GalleryRenderer } from "./gallery_renderer";

export const galleryView = {
    type: "gallery",
    display_name: "Gallery",
    icon: "oi oi-view-grid",
    multiRecord: true,
    Controller: GalleryController,
    ArchParser: GalleryArchParser,
    Model: GalleryModel,
    Renderer: GalleryRenderer,

    props(genericProps, view) {
        const { arch } = genericProps;
        const parser = new view.ArchParser();
        const archInfo = parser.parse(arch);
        return {
            ...genericProps,
            imageField: archInfo.imageField,
            Model: view.Model,
            Renderer: view.Renderer,
        };
    },
};

registry.category("views").add("gallery", galleryView);