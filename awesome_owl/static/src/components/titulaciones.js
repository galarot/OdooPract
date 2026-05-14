/** @odoo-module **/

import { Component, useState, onWillStart, onPatched } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { SelectMenu } from "@web/core/select_menu/select_menu";

export class Titulaciones extends Component {
  static template = "awesome_owl.titulaciones";
  static components = { SelectMenu };
  static props = {
        onSelect: Function
    }

  setup(){
    this.state = useState({ 
      value: ["Titulación"],
      titulaciones: [ ],
      choices: [ ],
      select: (e) => { this.state.selected = e},
      selected: "",
      area: "",
    });

    this.rpc = useService('rpc');

    onWillStart(async () => {
      const data = await this.rpc('/recruitment/titulaciones');
      this.state.titulaciones = data;
      var titulacion = {};
      
      for (var i = 0 ; i < this.state.titulaciones.length ; i++){
        titulacion = {};
        titulacion.value = this.state.titulaciones[i].id;
        titulacion.label = this.state.titulaciones[i].name;
        this.state.choices.push(titulacion);
      }

    });

    this.state.select = (value) => {
        this.state.selected = value;

        const selected = this.state.titulaciones.find(
            t => t.id === value
        );

        this.props.onSelect({
            value,
            area: selected?.area || "",
        });
    };

  }
  
}

