from odoo import api, fields, models
from datetime import date


class RycStudent(models.Model):
    _name = 'ryc.student'
    _description = 'Student'
    _rec_name = 'first_name'
    _inherit = ['mail.thread.cc', 'mail.activity.mixin']

    first_name = fields.Char(string='Nombre', required=True, tracking=True)
    last_name = fields.Char(string='Apellidos', required=True, tracking=True)
    full_name = fields.Char(string='Nombre completo', compute='_compute_full_name', store=True)
    disciplinary_count = fields.Integer(string='Nº de partes', compute='_compute_disciplinary_count')
    student_code = fields.Char(string='Código de alumno', compute='_compute_student_code', store=True)
    email = fields.Char(string='Correo electrónico', tracking=True)
    image = fields.Image(string='Foto')
    # grupo al que pertenece el alumno
    course_id = fields.Many2one('ryc.course', string='Curso', tracking=True)
    group_id = fields.Many2one('ryc.course.group', string='Grupo', tracking=True)
    # expedientes disciplinarios del alumno
    disciplinary_ids = fields.One2many('ryc.student.disciplinary', 'ryc_student', string='Expedientes disciplinarios')

    birth_date = fields.Date(string='Fecha de nacimiento', tracking=True)
    age = fields.Integer(string='Edad', compute='_compute_age', store=True)
    sex = fields.Selection([
        ('male', 'Hombre'),
        ('female', 'Mujer'),
        ('other', 'Otro'),
    ], string='Sexo', tracking=True)

    @api.depends('first_name', 'last_name')
    def _compute_full_name(self):
        for record in self:
            record.full_name = f"{record.first_name or ''} {record.last_name or ''}".strip()

    def _compute_disciplinary_count(self):
        for record in self:
            record.disciplinary_count = len(record.disciplinary_ids)

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
            if record.student_code:
                continue
            if record.first_name and record.last_name and record.birth_date:
                year = str(date.today().year)
                surnames = record.last_name.strip().split()
                initials = ''.join(s[0].upper() for s in surnames[:2])
                month = record.birth_date.strftime('%m')
                sequence = self.env['ir.sequence'].next_by_code('ryc.student') or '000000'
                record.student_code = f"{year}{initials}{month}{sequence}"
            else:
                record.student_code = False
