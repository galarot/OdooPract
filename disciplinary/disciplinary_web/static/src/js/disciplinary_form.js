/** @odoo-module **/

import { Component, useState, onMounted } from "@odoo/owl";

export class DisciplinaryForm extends Component {
    static template = "disciplinary_web.form_component";

    setup() {
        this.state = useState({
            formData: {
                ryc_student: '',
                incident_type: '',
                incident: '',
                date: new Date().toISOString().split('T')[0],
                time_slot: '',
                description: '',
            },
            students: [],
            loading: false,
            errors: {},
            step: 'form',
            successId: null,
        });

        // Vincular métodos
        this.updateField = this.updateField.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.createAnother = this.createAnother.bind(this);
        this.goToOdoo = this.goToOdoo.bind(this);
        this.loadStudents = this.loadStudents.bind(this);

        if (this.props.student) {
            this.state.formData.ryc_student = this.props.student.id.toString();
        }

        this.incidentTypes = [
            { value: 'discipline_report', label: 'Parte de disciplina' },
            { value: 'minor_offense', label: 'Falta leve' },
            { value: 'warning', label: 'Amonestación' },
        ];

        this.incidents = [
            { value: '1', label: 'Actos que perturban el normal desarrollo de la clase' },
            { value: '2', label: 'Falta de colaboración sistemática en la realización de las actividades' },
            { value: '3', label: 'Impedir o dificultar el estudio de los compañeros' },
            { value: '4', label: 'Faltas injustificadas de puntualidad' },
            { value: '5', label: 'Faltas injustificadas de asistencia a clase' },
            { value: '6', label: 'Actuaciones incorrectas o desconsideradas hacia algún miembro' },
            { value: '7', label: 'Causar pequeños daños en las instalaciones o documentos' },
            { value: '8', label: 'Otras conductas contrarias al Plan de Convivencia' },
            { value: '9', label: 'Amonestación - No llevar puesto el uniforme' },
        ];

        this.timeSlots = [
            { value: '08:00-09:00', label: '08:00 - 09:00 | Primera hora de la mañana' },
            { value: '09:00-10:00', label: '09:00 - 10:00 | Segunda hora de la mañana' },
            { value: '10:00-11:00', label: '10:00 - 11:00 | Tercera hora de la mañana' },
            { value: '11:00-11:30', label: '11:00 - 11:30 | Recreo de la mañana' },
            { value: '11:30-12:30', label: '11:30 - 12:30 | Cuarta hora de la mañana' },
            { value: '12:30-13:30', label: '12:30 - 13:30 | Quinta hora de la mañana' },
            { value: '13:30-14:30', label: '13:30 - 14:30 | Sexta hora de la mañana' },
            { value: '15:00-16:00', label: '15:00 - 16:00 | Primera hora de la tarde' },
            { value: '16:00-17:00', label: '16:00 - 17:00 | Segunda hora de la tarde' },
            { value: '17:00-18:00', label: '17:00 - 18:00 | Tercera hora de la tarde' },
            { value: '18:00-18:30', label: '18:00 - 18:30 | Recreo de la tarde' },
            { value: '18:30-19:30', label: '18:30 - 19:30 | Cuarta hora de la tarde' },
            { value: '19:30-20:30', label: '19:30 - 20:30 | Quinta hora de la tarde' },
            { value: '20:30-21:30', label: '20:30 - 21:30 | Sexta hora de la tarde' },
        ];

        onMounted(async() => {
            // Solo cargar estudiantes si no hay uno preseleccionado
            if (!this.props.student) {
                await this.loadStudents();
            }
        });
    }

    async loadStudents() {
        this.state.loading = true;
        try {
            const response = await fetch('/student/disciplinary/get_students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {},
                })
            });
            const data = await response.json();
            if (data.result && data.result.students) {
                this.state.students = data.result.students;
            } else if (data.error) {
                console.error('RPC Error:', data.error);
            }
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            this.state.loading = false;
        }
    }

    updateField(field, value) {
        this.state.formData[field] = value;
        if (this.state.errors[field]) {
            delete this.state.errors[field];
        }
    }

    validateForm() {
        const errors = {};
        const { ryc_student, incident_type, incident, date, time_slot } = this.state.formData;

        // Solo validar estudiante si no hay uno preseleccionado
        if (!this.props.student && !ryc_student) {
            errors.ryc_student = 'El estudiante es requerido';
        }

        if (!incident_type) errors.incident_type = 'El tipo de incidencia es requerido';
        if (!incident) errors.incident = 'La conducta es requerida';
        if (!date) errors.date = 'La fecha es requerida';
        if (!time_slot) errors.time_slot = 'La franja horaria es requerida';

        this.state.errors = errors;
        return Object.keys(errors).length === 0;
    }

    async submitForm() {
        if (!this.validateForm()) {
            return;
        }

        this.state.loading = true;
        try {
            // Preparar los datos del formulario
            const formData = {...this.state.formData };

            // Si hay estudiante preseleccionado, usar su ID
            if (this.props.student) {
                formData.ryc_student = this.props.student.id.toString();
            }

            const response = await fetch('/student/disciplinary/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: formData,
                })
            });
            const data = await response.json();

            if (data.result && data.result.status === 'success') {
                this.state.successId = data.result.id;
                this.state.step = 'success';
            } else {
                this.state.errors.submit = data.result ? data.result.message : (data.error ? data.error.message : 'Error desconocido');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.state.errors.submit = 'Error al guardar el parte disciplinario';
        } finally {
            this.state.loading = false;
        }
    }

    resetForm() {
        this.state.formData = {
            ryc_student: this.props.student ? this.props.student.id.toString() : '',
            incident_type: '',
            incident: '',
            date: new Date().toISOString().split('T')[0],
            time_slot: '',
            description: '',
        };
        this.state.errors = {};
    }

    createAnother() {
        this.state.step = 'form';
        this.resetForm();
    }

    goToOdoo() {
        window.location.href = '/web';
    }
}

DisciplinaryForm.components = {};

export class DisciplinaryApp extends Component {
    static template = "disciplinary_web.form_app";
    static components = { DisciplinaryForm };

    setup() {
        this.DisciplinaryForm = DisciplinaryForm;
    }
}