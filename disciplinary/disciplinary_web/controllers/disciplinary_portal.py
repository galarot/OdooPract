from odoo import http
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)


class DisciplinaryWeb(http.Controller):

    def _has_access(self, user):
        if user.has_group('base.group_system'):
            return True
        if user.has_group('ryc_student_disciplinary.group_disciplinary_admin'):
            return True
        if user.has_group('ryc_student_disciplinary.group_disciplinary_profesor'):
            return True
        return request.env['ryc.course.group'].search_count([('tutor_id.user_id', '=', user.id)]) > 0

    @http.route('/student/disciplinary/new', auth='user', type='http', website=True)
    def new_disciplinary(self, **kw):
        """Mostrar formulario para registrar parte disciplinario"""
        user = request.env.user

        if not self._has_access(user):
            _logger.warning(f"Acceso denegado para usuario {user.name} - no tiene permisos suficientes")
            return request.render('disciplinary_web.unauthorized', {
                'error_message': f'Usuario {user.name} no tiene permisos para acceder a esta sección.'
            })

        # Obtener estudiante preseleccionado si viene en los parámetros
        student_id = kw.get('student_id')
        student = None
        if student_id:
            try:
                student = request.env['ryc.student'].browse(int(student_id))
                if not student.exists():
                    student = None
            except (ValueError, TypeError):
                student = None

        return request.render('disciplinary_web.form', {
            'student': student,
        })

    @http.route('/student/disciplinary/save', auth='user', type='json', website=True)
    def save_disciplinary(self, **kw):
        """Guardar parte disciplinario"""
        user = request.env.user

        if not self._has_access(user):
            return {'status': 'error', 'message': 'No autorizado'}

        try:
            # Crear el registro
            record = request.env['ryc.student.disciplinary'].create({
                'ryc_student': int(kw.get('ryc_student')),
                'incident_type': kw.get('incident_type'),
                'incident': kw.get('incident'),
                'date': kw.get('date'),
                'time_slot': kw.get('time_slot'),
                'description': kw.get('description', ''),
                'ryc_teacher': user.partner_id.id,
            })

            _logger.info(f"Parte disciplinario creado por {user.name}: ID {record.id}")
            return {'status': 'success', 'id': record.id}

        except Exception as e:
            _logger.error(f"Error al guardar parte disciplinario: {e}")
            return {'status': 'error', 'message': str(e)}

    @http.route('/student/disciplinary/get_students', auth='user', type='json', website=True)
    def get_students(self, **kw):
        """Obtener estudiantes del tutor"""
        user = request.env.user

        if not self._has_access(user):
            return {'status': 'error', 'message': 'No autorizado'}

        if user.has_group('base.group_system') or user.has_group('ryc_student_disciplinary.group_disciplinary_admin'):
            students = request.env['ryc.student'].search([])
        else:
            groups = request.env['ryc.course.group'].search([('tutor_id.user_id', '=', user.id)])
            students = request.env['ryc.student'].search([('group_id', 'in', groups.ids)])

        return {
            'students': [{
                'id': s.id,
                'name': s.full_name,
                'code': s.student_code,
            } for s in students]
        }
