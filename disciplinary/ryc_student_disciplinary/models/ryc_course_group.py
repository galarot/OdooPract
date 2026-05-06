from odoo import api, fields, models


class RycCourseGroup(models.Model):
    _name = 'ryc.course.group'
    _description = 'Course Group'
    _inherit = ['mail.thread.cc', 'mail.activity.mixin']

    name = fields.Char(string='Nombre', required=True, tracking=True)
    code = fields.Char(string='Código', tracking=True)
    # cursos a los que pertenece este grupo
    course_ids = fields.Many2many('ryc.course', string='Cursos')
    # profesor tutor de este grupo
    tutor_id = fields.Many2one('hr.employee', string='Tutor', tracking=True)
    student_count = fields.Integer(string='Nº de alumnos', compute='_compute_student_count', store=True)
    student_ids = fields.One2many('ryc.student', 'group_id', string='Alumnos')

    @api.depends('student_ids')
    def _compute_student_count(self):
        for record in self:
            record.student_count = len(record.student_ids)

    _sql_constraints = [
        ('name_unique', 'UNIQUE(name)', 'Ya existe un grupo con ese nombre.'),
    ]

    def write(self, vals):
        if 'course_ids' in vals:
            for record in self:
                old = record.course_ids.mapped('name')
                res = super().write(vals)
                new = record.course_ids.mapped('name')
                added = set(new) - set(old)
                removed = set(old) - set(new)
                if added:
                    record.message_post(body=f"Cursos añadidos: {', '.join(sorted(added))}")
                if removed:
                    record.message_post(body=f"Cursos eliminados: {', '.join(sorted(removed))}")
                return res
        return super().write(vals)
