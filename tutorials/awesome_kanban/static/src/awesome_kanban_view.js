/** @odoo-module **/

import { registry } from "@web/core/registry";
import { kanbanView } from "@web/views/kanban/kanban_view";
import { KanbanController } from "@web/views/kanban/kanban_controller";
import { CustomerList } from "./customer_list";

class AwesomeKanbanController extends KanbanController {
    static template = "awesome_kanban.AwesomeKanbanController";
    static components = {...KanbanController.components, CustomerList };

    setup() {
        super.setup();
    }

    selectCustomer(partner_id, partner_name) {
        // Limpiar filtros previos de nuestra autoría
        const customerFilters = this.env.searchModel.getSearchItems((searchItem) =>
            searchItem.isFromAwesomeKanban
        );
        for (const customerFilter of customerFilters) {
            if (customerFilter.isActive) {
                this.env.searchModel.toggleSearchItem(customerFilter.id);
            }
        }

        // Crear el nuevo filtro para el cliente seleccionado
        this.env.searchModel.createNewFilters([{
            description: partner_name,
            domain: [
                ["partner_id", "=", partner_id]
            ],
            isFromAwesomeKanban: true,
        }]);
    }
}

export const awesomeKanbanView = {
    ...kanbanView,
    Controller: AwesomeKanbanController,
};

registry.category("views").add("awesome_kanban", awesomeKanbanView);