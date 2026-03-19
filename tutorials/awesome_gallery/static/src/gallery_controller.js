/** @odoo-module **/
import { Component, onWillStart, onWillUpdateProps, useState } from "@odoo/owl";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { usePager } from "@web/search/pager_hook";

export class GalleryController extends Component {
    static template = "awesome_gallery.GalleryController";
    static components = { Layout };

    setup() {
        this.orm = useService("orm");

        this.model = new this.props.Model(
            this.orm,
            this.props.resModel, {
                imageField: this.props.imageField,
                tooltipField: this.props.tooltipField,
                fieldNames: this.props.fieldNames || [],
            }
        );

        this.state = useState({
            offset: 0,
            limit: 20,
        });

        onWillStart(async () => {
            await this.model.load(this.props.domain, this.state.offset, this.state.limit);
        });

        onWillUpdateProps(async (nextProps) => {
            this.state.offset = 0;
            await this.model.load(nextProps.domain, 0, this.state.limit);
        });

        usePager(() => ({
            offset: this.state.offset,
            limit: this.state.limit,
            total: this.model.recordCount,
            onUpdate: async ({ offset, limit }) => {
                this.state.offset = offset;
                this.state.limit = limit;
                await this.model.load(this.props.domain, offset, limit);
            },
        }));
    }

    async onImageUploaded() {
        await this.model.load(this.props.domain, this.state.offset, this.state.limit);
    }
}
