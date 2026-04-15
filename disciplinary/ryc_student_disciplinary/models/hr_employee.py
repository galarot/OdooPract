from odoo import api, fields, models


class HrEmployee(models.Model):
    _inherit = 'hr.employee'

    is_tutor = fields.Boolean(string='Es tutor')
    # grupo del que es tutor, solo visible si is_tutor es verdadero
    course_tutor = fields.Many2one('ryc.course.group', string='Grupo tutor')
