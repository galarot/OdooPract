/** @odoo-module **/

import { Component, useState, onWillStart, onPatched } from "@odoo/owl";

export class Guardar extends Component {
  static template = "awesome_owl.guardar";

  setup() {
    this.state = useState({
      disable: false,
    });

    onWillStart(() => {});
    onPatched(() => {});
  }

  async guardar() {
    try {
      this.state.disable = true;

      const response = await fetch('/public/create_applicant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            data: this.props.data
          }
        })
      });

      const result = await response.json();

      if (result.result?.success) {
        alert("Registro creado con éxito. ID: " + result.result.id);
      } else {
        const errorMsg = result.result?.error || result.error?.message || 'Error desconocido';
        console.error("Error del servidor:", errorMsg);
        alert("Error al crear el registro: " + errorMsg);
      }

    } catch (error) {
      console.error("Error al crear el registro", error);
      alert("Error de conexión");
    } finally {
      this.state.disable = false;
    }
  }
}