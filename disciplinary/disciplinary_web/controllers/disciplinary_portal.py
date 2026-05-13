from odoo import http
from odoo.http import request


class DisciplinaryWeb(http.Controller):

    @http.route('/student/disciplinary/new', auth='user', type='http', website=True)
    def new_disciplinary(self, **kw):
        """Mostrar formulario para registrar parte disciplinario"""
        user = request.env.user
        group = request.env.ref('ryc_student_disciplinary.group_disciplinary_profesor', raise_if_not_found=False)
        
        if not group or group not in user.groups_id:
            return request.render('disciplinary_web.unauthorized')
        
        return request.render('disciplinary_web.form')

    @http.route('/student/disciplinary/save', auth='user', type='json', website=True)
    def save_disciplinary(self, **kw):
        """Guardar parte disciplinario"""
        user = request.env.user
        group = request.env.ref('ryc_student_disciplinary.group_disciplinary_profesor', raise_if_not_found=False)
        
        if not group or group not in user.groups_id:
            return {'status': 'error', 'message': 'No autorizado'}
        
        try:
            record = request.env['ryc.student.disciplinary'].create({
                'ryc_student': int(kw.get('ryc_student')),
                'incident_type': kw.get('incident_type'),
                'incident': kw.get('incident'),
                'date': kw.get('date'),
                'time_slot': kw.get('time_slot'),
                'description': kw.get('description', ''),
                'ryc_teacher': user.partner_id.id,
            })
            return {'status': 'success', 'id': record.id}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    @http.route('/student/disciplinary/get_students', auth='user', type='json', website=True)
    def get_students(self, **kw):
        """Obtener estudiantes del tutor"""
        user = request.env.user
        groups = request.env['ryc.course.group'].search([('tutor_id.user_id', '=', user.id)])
        students = request.env['ryc.student'].search([('group_id', 'in', groups.ids)])
        
        return {
            'students': [{
                'id': s.id,
                'name': s.full_name,
                'code': s.student_code,
            } for s in students]
        }
