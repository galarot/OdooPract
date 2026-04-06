from odoo import fields, models


class RycCourse(models.Model):
    _name = 'ryc.course'
    _description = 'Course'

    name = fields.Char(string='Nombre', required=True)
    code = fields.Char(string='Código')
    #nivel educativo al que pertenece
    level_id = fields.Many2one('ryc.course.level', string='Nivel')
    #grupos que tiene
    group_ids = fields.One2many('ryc.course.group', 'course_id', string='Grupos')
    # alumnos matriculados en este curso
    student_ids = fields.One2many('ryc.student', 'course_id', string='Alumnos')
