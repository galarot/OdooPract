/** @odoo-module **/

import { Component, onWillStart, onWillUpdateProps } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout };

    setup() {
        this.orm = useService("orm");


        this.model = new this.props.Model(
            this.orm,
            this.props.resModel,
            this.props.imageField
        );

        onWillStart(async() => {
            await this.model.load(this.props.domain);
        });

        onWillUpdateProps(async(nextProps) => {
            await this.model.load(nextProps.domain);
        });
    }
}