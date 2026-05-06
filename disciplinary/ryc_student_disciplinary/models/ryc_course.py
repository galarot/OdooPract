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

    def write(self, vals):
        if 'group_ids' in vals:
            for record in self:
                old = record.group_ids.mapped('name')
                res = super().write(vals)
                new = record.group_ids.mapped('name')
                added = set(new) - set(old)
                removed = set(old) - set(new)
                if added:
                    record.message_post(body=f"Grupos añadidos: {', '.join(sorted(added))}")
                if removed:
                    record.message_post(body=f"Grupos eliminados: {', '.join(sorted(removed))}")
                return res
        return super().write(vals)
