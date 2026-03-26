from odoo import fields, models


class RycCourseLevel(models.Model):
    _name = 'ryc.course.level'
    _description = 'Course Level'

    name = fields.Char(string='Nombre', required=True)
    # cursos que pertenecen
    course_ids = fields.One2many('ryc.course', 'level_id', string='Cursos')
