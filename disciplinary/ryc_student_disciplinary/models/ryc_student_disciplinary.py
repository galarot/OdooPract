from odoo import fields, models


class RycStudentDisciplinary(models.Model):
    _name = 'ryc.student.disciplinary'
    _description = 'Student Disciplinary'
    _inherit = ['mail.thread.cc', 'mail.activity.mixin']

    #alumno al que pertenece expediente
    ryc_student = fields.Many2one('ryc.student', string='Alumno', required=True, tracking=True)
    incident_type = fields.Selection([
        ('discipline_report', 'Parte de disciplina'),
        ('minor_offense', 'Falta leve'),
        ('warning', 'Amonestación'),
    ], string='Tipo de incidencia', tracking=True)
    incident = fields.Selection([
        ('1', 'Actos que perturban el normal desarrollo de la clase'),
        ('2', 'Falta de colaboración sistemática en la realización de las actividades orientadas al desarrollo del currículo'),
        ('3', 'Impedir o dificultar el estudio de los compañeros'),
        ('4', 'Faltas injustificadas de puntualidad'),
        ('5', 'Faltas injustificadas de asistencia a clase'),
        ('6', 'Actuaciones incorrectas o desconsideradas hacia algún miembro de la comunidad educativa'),
        ('7', 'Causar pequeños daños en las instalaciones o documentos del centro o en pertenencias de un miembro del mismo'),
        ('8', 'Otras conductas contrarias al Plan de Convivencia'),
        ('9', 'Amonestación - No llevar puesto el uniforme'),
    ], string='Conducta', tracking=True)
    date = fields.Date(string='Fecha', tracking=True)
    description = fields.Char(string='Observaciones', tracking=True)
    time_slot = fields.Selection([
        ('08:00-09:00', '08:00 - 09:00 | Primera hora de la mañana'),
        ('09:00-10:00', '09:00 - 10:00 | Segunda hora de la mañana'),
        ('10:00-11:00', '10:00 - 11:00 | Tercera hora de la mañana'),
        ('11:00-11:30', '11:00 - 11:30 | Recreo de la mañana'),
        ('11:30-12:30', '11:30 - 12:30 | Cuarta hora de la mañana'),
        ('12:30-13:30', '12:30 - 13:30 | Quinta hora de la mañana'),
        ('13:30-14:30', '13:30 - 14:30 | Sexta hora de la mañana'),
        ('15:00-16:00', '15:00 - 16:00 | Primera hora de la tarde'),
        ('16:00-17:00', '16:00 - 17:00 | Segunda hora de la tarde'),
        ('17:00-18:00', '17:00 - 18:00 | Tercera hora de la tarde'),
        ('18:00-18:30', '18:00 - 18:30 | Recreo de la tarde'),
        ('18:30-19:30', '18:30 - 19:30 | Cuarta hora de la tarde'),
        ('19:30-20:30', '19:30 - 20:30 | Quinta hora de la tarde'),
        ('20:30-21:30', '20:30 - 21:30 | Sexta hora de la tarde'),
    ], string='Franja horaria', tracking=True)
    # Profesor que registra la incidencia (viene de res.partner)
    ryc_teacher = fields.Many2one('res.partner', string='Profesor', default=lambda self: self.env.user.partner_id, tracking=True)
