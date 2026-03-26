from odoo import fields, models


class RycCourseGroup(models.Model):
    _name = 'ryc.course.group'
    _description = 'Course Group'

    name = fields.Char(string='Nombre', required=True)
    # curso al que pertenece
    course_id = fields.Many2one('ryc.course', string='Curso')
