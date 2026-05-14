/** @odoo-module **/

import { Component, useState, onWillStart, onPatched, useRef } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { Titulaciones } from "./titulaciones";
import { Notebook } from "@web/core/notebook/notebook";
import { Guardar } from "./guardar";
import { CheckBox } from "@web/core/checkbox/checkbox";
import { DatePicker } from "@web/core/datetime/datetime_picker";

export class Autobaremo extends Component {
  static template = "awesome_owl.autobaremo";
  static components = { Titulaciones, Notebook, Guardar, CheckBox, DatePicker };
  setup() {
    this.orm = useService("orm");
    this.state = useState({
      nombre: "",
      apellidos: "",
      email: "",
      titulacion: null,
      area: null,
      fecha_expedicion: false,
      ma_titulacion_exigida: null, // Campo 1.1 - '0.5' o '0.25'
      ma_expediente_academico: null, // Campo 1.2 - '0.5', '0.3', '0.2', '0'
      maescap: false, // Campo 1.3 - '1' o '0'
      ma_td_doctor: "0", // Campo 1.4.1
      ma_td_si: "0", // Campo 1.4.2
      ma_td_otra_mas: "0",
      ma_td_otra_lic: "0", // Campo 1.4.3 + 1.4.4
      ma_td_otra_dip: "0", // Campo 1.4.5
      ma_td_cfgs: "0", // Campo 1.4.6
      ingles: "0",
      frances: "0",
      cursos_realizados: "0", // Campo 2.1 - Horas (0.01 puntos por cada 10h)
      ed_meses_trabajados_tear: "0", // Campo 3.1.1 - Meses en TEAR
      ed_meses_trabajados_er: "0", // Campo 3.2.1 - Meses en otros centros
      isSaving: false,
      acceptedTerms: false,
    });
    this.nombreRef = useRef("nombre");
    this.apellidosRef = useRef("apellidos");
    this.titulacionRef = useRef("titulacion");
    this.fechaExpedicionRef = useRef("fecha_expedicion")
    this.emailRef = useRef("email");
    this.titulacionExigidaRef = useRef("titulacion_exigida");
    this.file11Ref = useRef("file11");
    this.expedienteAcadRef = useRef("expediente_academico");
    this.file12Ref = useRef("file12");
    this.maescapRef = useRef("maescap");
    this.file13Ref = useRef("file13");
    this.file14Ref = useRef("file14");
    this.file15Ref = useRef("file15");
    this.file2Ref = useRef("file2");
    this.file3Ref = useRef("file3");

    this.updateSelected = (data) => {
        this.state.titulacion = data.value;
        this.state.area = data.area["0"];
    };

    onPatched(() => {
      this.state.ncompleto = this.state.apellidos + ", " + this.state.nombre;
    });

  }

  async saveForm(ev) {
        ev.preventDefault();
        console.log(this.state.area);

        const fields = [
            { ref: this.nombreRef, value: this.state.nombre, name: "Nombre" },
            { ref: this.apellidosRef, value: this.state.apellidos, name: "Apellidos"  },
            { ref: this.fechaExpedicionRef , value: this.state.fecha_expedicion, name: "Fecha de expedición del título"  },
            { ref: this.titulacionExigidaRef , value: this.state.ma_titulacion_exigida, name: "Titulación exigida"  },
            { ref: this.file11Ref, value: this.file11Ref.el?.files?.length ? "1" : "", name: "Adjuntar título universitario"  },
            { ref: this.expedienteAcadRef , value: this.state.ma_expediente_academico, name: "Expediente académico"},
            { ref: this.file12Ref, value: this.file12Ref.el?.files?.length ? "1" : "", name: "Adjuntar certificado académico"  },
        ];

        if (this.state.area !== 2 && !(this.file13Ref.el?.files?.length > 0)){
            alert("Debes adjuntar CAP o MAES");
            if (this.file13Ref?.el) {
                this.file13Ref.el.scrollIntoView({ behavior: "smooth", block: "center" });
                this.file13Ref.el.focus();
            }
            return;
        }

        const hasMaValue =
            Number(this.state.ma_td_doctor) > 0 ||
            Number(this.state.ma_td_si) > 0 ||
            Number(this.state.ma_td_otra_mas) > 0 ||
            Number(this.state.ma_td_otra_lic) > 0 ||
            Number(this.state.ma_td_otra_dip) > 0 ||
            Number(this.state.ma_td_cfgs) > 0;

        if (hasMaValue && !(this.file14Ref.el?.files?.length > 0)) {
            alert("Debes adjuntar los títulos distintos al presentado para la plaza");
            if (this.file14Ref?.el) {
                this.file14Ref.el.scrollIntoView({ behavior: "smooth", block: "center" });
                this.file14Ref.el.focus();
            }
            return;
        }

        const idiomas =
            ["B1", "B2", "C1", "C2"].includes(this.state.ingles) ||
            ["B1", "B2", "C1", "C2"].includes(this.state.frances);

        if (idiomas && !(this.file15Ref.el?.files?.length > 0)) {
            alert("Debes adjuntar los títulos oficiales de idiomas (nivel B1 o superior)");

            if (this.file15Ref?.el) {
                this.file15Ref.el.scrollIntoView({ behavior: "smooth", block: "center" });
                this.file15Ref.el.focus();
            }

            return;
        }

        const cursosRealizados = Number(this.state.cursos_realizados) > 0;

        if (cursosRealizados && !(this.file2Ref.el?.files?.length > 0)) {
            alert("Debes adjuntar los certificados de los cursos realizados");

            if (this.file2Ref?.el) {
                this.file2Ref.el.scrollIntoView({ behavior: "smooth", block: "center" });
                this.file2Ref.el.focus();
            }

            return;
        }

        const experienciaDocente =
            Number(this.state.ed_meses_trabajados_tear) > 0 ||
            Number(this.state.ed_meses_trabajados_er) > 0;

        if (experienciaDocente && !(this.file3Ref.el?.files?.length > 0)) {
            alert("Debes adjuntar los certificados de experiencia docente");

            if (this.file3Ref?.el) {
                this.file3Ref.el.scrollIntoView({ behavior: "smooth", block: "center" });
                this.file3Ref.el.focus();
            }

            return;
        }

        const invalid = fields.find(f => !f.value?.trim?.());

        if (invalid) {
            alert("Rellene el campo obligatorio: "+invalid.name);

            if (invalid.ref?.el) {
                invalid.ref.el.scrollIntoView({ behavior: "smooth", block: "center" });
                invalid.ref.el.focus();
            }
            return;
        }

        if (!this.state.titulacion) {
            alert("Seleccione una titulación válida");
            this.titulacionRef.el.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const getFiles = (ref) => {
            return ref.el?.files ? Array.from(ref.el.files) : [];
        };

        const files = [
            ...getFiles(this.file11Ref),
            ...getFiles(this.file12Ref),
            ...getFiles(this.file13Ref),
            ...getFiles(this.file14Ref),
            ...getFiles(this.file15Ref),
            ...getFiles(this.file2Ref),
            ...getFiles(this.file3Ref),
        ];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.state.email)) {
            alert("Correo electrónico no válido");

            if (this.emailRef?.el) {
                this.emailRef.el.scrollIntoView({ behavior: "smooth", block: "center" });
                this.emailRef.el.focus();
            }

            return;
        }

        const regexFecha = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19\d{2}|20([01]\d|2[0-6]))$/;;
        let fechaExpedicion = "";
        if (!regexFecha.test(this.state.fecha_expedicion)) {
            alert("La fecha debe estar en formato DD-MM-AAAA")
            this.fechaExpedicionRef.el.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        } else {
            const [day, month, year] = this.state.fecha_expedicion.split("-");
            fechaExpedicion = `${year}-${month}-${day}`;
        }

        let ma_td_otra_lic = 0;
        if (this.state.ma_td_otra_lic && this.state.ma_td_otra_mas) {
            ma_td_otra_lic = parseInt(this.state.ma_td_otra_lic, 10) + parseInt(this.state.ma_td_otra_mas, 10);
        }

        let job_id = 1;
        if(this.state.area === 2){
            job_id = 9;
        }

        const formData = new FormData();

        // datos
        formData.append("job_id", job_id || 1);
        formData.append("name", this.state.nombre + " " + this.state.apellidos);
        formData.append("email_from", this.state.email);
        formData.append("titulacion", this.state.titulacion ? parseInt(this.state.titulacion, 10) : "");
        formData.append("fecha_expedicion", fechaExpedicion);
        formData.append("ma_titulacion_exigida",this.state.ma_titulacion_exigida || "");
        formData.append("ma_expediente_academico", this.state.ma_expediente_academico || "");
        formData.append("posesion_cap_maes", this.state.maescap ? true : false);
        formData.append("ma_td_doctor", this.state.ma_td_doctor || 0);
        formData.append("ma_td_si", this.state.ma_td_si || 0);
        formData.append("ma_td_otra_lic", ma_td_otra_lic || 0);
        formData.append("ma_td_otra_dip", this.state.ma_td_otra_dip || 0);
        formData.append("ma_td_cfgs", this.state.ma_td_cfgs || 0);
        formData.append("ingles", this.state.ingles || 0);
        formData.append("frances", this.state.frances || 0);
        formData.append("cursos_realizados", this.state.cursos_realizados || 0);
        formData.append("ed_meses_trabajados_tear", this.state.ed_meses_trabajados_tear || 0);
        formData.append("ed_meses_trabajados_er", this.state.ed_meses_trabajados_er || 0);

        // archivos
        files.forEach((file, index) => {
            formData.append("files", file);
        });

        if(this.state.acceptedTerms === false){
            alert("Al enviar la solicitud confirma que todos los datos y archivos enviados son verídicos. Si es así, vuelva a pulsar en Enviar solicitud.");
            this.state.acceptedTerms = true;
            return;
        }

        this.state.isSaving = true;

        try {
            const response = await fetch("/public/create_applicant", {
                method: "POST",
                body: formData,
            });
            const text = await response.text();

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("Respuesta no JSON:", text);
                throw new Error("El servidor no devolvió JSON válido");
            }

            if (result.success) {
                 window.location.href =
                    `${result.redirect_url}?email=${encodeURIComponent(this.state.email)}`;
                return;
            } else {
                alert("Error: " + (result.error || "Error desconocido"));
                console.error(result);
            }

        } catch (error) {
            console.error("Error al guardar la postulación:", error);
            alert("Error de conexión al enviar la postulación.");
        } finally {
            this.state.isSaving = false;
        }
    }


}
