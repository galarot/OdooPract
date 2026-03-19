/** @odoo-module **/
import { KeepLast } from "@web/core/utils/concurrency";

export class GalleryModel {
    constructor(orm, resModel, fields) {
        this.orm = orm;
        this.resModel = resModel;
        this.fields = fields;
        this.keepLast = new KeepLast();
        this.records = [];
        this.recordCount = 0;
        this.offset = 0;
        this.limit = 20;
    }

    async load(domain, offset = this.offset, limit = this.limit) {
        const specification = {
            display_name: {},
            write_date: {},
        };
        specification[this.fields.imageField] = {};
        if (this.fields.tooltipField) {
            specification[this.fields.tooltipField] = {};
        }
        for (const fieldName of (this.fields.fieldNames || [])) {
            specification[fieldName] = {};
        }

        const { records, length } = await this.keepLast.add(
            this.orm.webSearchRead(this.resModel, domain, {
                specification,
                context: { bin_size: true },
                offset,
                limit,
            })
        );
        this.records = records;
        this.recordCount = length;
        this.offset = offset;
        this.limit = limit;
    }
}
