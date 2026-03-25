/** @odoo-module **/

import { Component, onWillStart, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { fuzzyLookup } from "@web/core/utils/search";
import { Pager } from "@web/core/pager/pager"; // Importamos el Pager de Odoo

export class CustomerList extends Component {
    static template = "awesome_kanban.CustomerList";
    static props = {
        selectCustomer: Function,
    };
    static components = { Pager };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            displayActiveCustomers: false,
            searchString: "",
            offset: 0,
            limit: 20,
            count: 0, // Necesario para que el Pager sepa el total
        });
        this.customers = [];

        onWillStart(async() => {
            await this.loadCustomers();
        });
    }

    async loadCustomers() {
        const domain = this.state.displayActiveCustomers ?
            [
                ["opportunity_ids", "!=", false]
            ] :
            [];

        // 1. Obtenemos el total de registros para el dominio actual
        this.state.count = await this.orm.searchCount("res.partner", domain);

        // 2. Cargamos solo los 20 que tocan según el offset
        this.customers = await this.orm.searchRead("res.partner", domain, ["display_name"], {
            limit: this.state.limit,
            offset: this.state.offset,
        });
    }

    get displayedCustomers() {
        if (!this.state.searchString) {
            return this.customers;
        }
        return fuzzyLookup(this.state.searchString, this.customers, (c) => c.display_name);
    }

    // Función para cuando movemos el Pager
    async onUpdatePager(newState) {
        Object.assign(this.state, newState);
        await this.loadCustomers();
    }

    // Resetear al cambiar el filtro de "Activos"
    async onChangeActiveCustomers() {
        this.state.offset = 0; // Volvemos a la página 1
        await this.loadCustomers();
    }
}