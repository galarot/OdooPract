from odoo import fields, models


class RycCourseGroup(models.Model):
    _name = 'ryc.course.group'
    _description = 'Course Group'

    name = fields.Char(string='Nombre', required=True)
    code = fields.Char(string='Código')
    # cursos a los que pertenece este grupo
    course_ids = fields.Many2many('ryc.course', string='Cursos')
    # profesor tutor de este grupo
    tutor_id = fields.Many2one('hr.employee', string='Tutor')
