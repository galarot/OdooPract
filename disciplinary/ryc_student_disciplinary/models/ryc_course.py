from odoo import fields, models


class RycCourse(models.Model):
    _name = 'ryc.course'
    _description = 'Course'
    _inherit = ['mail.thread.cc', 'mail.activity.mixin']

    name = fields.Char(string='Nombre', required=True, tracking=True)
    code = fields.Char(string='Código', tracking=True)
    #nivel educativo al que pertenece
    level_id = fields.Many2one('ryc.course.level', string='Nivel', tracking=True)
    #grupos que tiene
    group_ids = fields.Many2many('ryc.course.group', string='Grupos')
    # alumnos matriculados en este curso
    student_ids = fields.One2many('ryc.student', 'course_id', string='Alumnos')

    _sql_constraints = [
        ('name_unique', 'UNIQUE(name)', 'Ya existe un curso con ese nombre.'),
    ]
