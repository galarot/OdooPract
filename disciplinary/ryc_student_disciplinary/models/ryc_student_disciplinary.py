from odoo import fields, models


class RycStudentDisciplinary(models.Model):
    _name = 'ryc.student.disciplinary'
    _description = 'Student Disciplinary'

    name = fields.Char(required=True)
