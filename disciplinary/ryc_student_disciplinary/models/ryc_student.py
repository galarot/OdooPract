from odoo import api, fields, models
from datetime import date


class RycStudent(models.Model):
    _name = 'ryc.student'
    _description = 'Student'
    _rec_name = 'first_name'

    first_name = fields.Char(string='Nombre', required=True)
    last_name = fields.Char(string='Apellidos', required=True)
    student_code = fields.Char(string='Código de alumno', compute='_compute_student_code', store=True)
    email = fields.Char(string='Correo electrónico')
    # grupo al que pertenece el alumno
    group_id = fields.Many2one('ryc.course.group', string='Grupo')
    # expedientes disciplinarios del alumno
    disciplinary_ids = fields.One2many('ryc.student.disciplinary', 'ryc_student', string='Expedientes disciplinarios')

    birth_date = fields.Date(string='Fecha de nacimiento')
    age = fields.Integer(string='Edad', compute='_compute_age', store=True)
    sex = fields.Selection([
        ('male', 'Hombre'),
        ('female', 'Mujer'),
        ('other', 'Otro'),
    ], string='Sexo')

    @api.depends('birth_date')
    def _compute_age(self):
        today = date.today()
        for record in self:
            if record.birth_date:
                record.age = today.year - record.birth_date.year - (
                    (today.month, today.day) < (record.birth_date.month, record.birth_date.day)
                )
            else:
                record.age = 0

    @api.depends('first_name', 'last_name', 'birth_date')
    def _compute_student_code(self):
        for record in self:
            if record.first_name and record.last_name and record.birth_date:
                year = str(date.today().year)
                surnames = record.last_name.strip().split()
                initials = ''.join(s[0].upper() for s in surnames[:2])
                month = record.birth_date.strftime('%m')
                sequence = self.env['ir.sequence'].next_by_code('ryc.student') or '000000'
                record.student_code = f"{year}{initials}{month}{sequence}"
            else:
                record.student_code = False
