odoo.define('disciplinary_web', function(require) {
    'use strict';

    // Registrar el componente OWL
    const { registry } = require("@web/core/registry");
    const { DisciplinaryForm } = require('disciplinary_web/static/src/js/disciplinary_form');

    // Registrar el componente en el registro de componentes
    registry.category("components").add("DisciplinaryForm", DisciplinaryForm);
});