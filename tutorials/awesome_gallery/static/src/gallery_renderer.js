/** @odoo-module **/
import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { FileUploader } from "@web/views/fields/file_handler";

export class GalleryRenderer extends Component {
    static template = "awesome_gallery.GalleryRenderer";
    static components = { FileUploader };

    setup() {
        this.action = useService("action");
        this.orm = useService("orm");
    }

    onRecordClick(recordId) {
        this.action.switchView("form", { resId: recordId });
    }

    async onImageUploaded(record, { data }) {
        await this.orm.webSave(
            this.props.model,
            [record.id],
            { [this.props.imageField]: data },
            { specification: { write_date: {}, [this.props.imageField]: {} } }
        );
        await this.props.onImageUploaded();
    }

    getImageUrl(record) {
        return `/web/image?model=${this.props.model}&id=${record.id}&field=${this.props.imageField}&unique=${record.write_date}`;
    }

    getTooltipText(record) {
        if (this.props.tooltipTemplate) return null;
        if (this.props.tooltipField) {
            const value = record[this.props.tooltipField];
            return Array.isArray(value) ? value[1] : value;
        }
        return null;
    }

    getTooltipInfo(record) {
        if (this.props.tooltipTemplate) {
            return JSON.stringify({ record });
        }
        return null;
    }
}
