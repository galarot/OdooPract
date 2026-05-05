from odoo import fields, models


class RycCourseLevel(models.Model):
    _name = 'ryc.course.level'
    _description = 'Course Level'
    _inherit = ['mail.thread.cc', 'mail.activity.mixin']

    name = fields.Char(string='Nombre', required=True, tracking=True)
    # cursos que pertenecen
    course_ids = fields.One2many('ryc.course', 'level_id', string='Cursos')

    _sql_constraints = [
        ('name_unique', 'UNIQUE(name)', 'Ya existe un nivel con ese nombre.'),
    ]
