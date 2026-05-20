from odoo import http
from odoo.http import request
import logging
import json

_logger = logging.getLogger(__name__)


class DisciplinaryWeb(http.Controller):

    def _has_access(self, user):
        if user.has_group('base.group_system'):
            _logger.info(f"Acceso permitido para {user.name} (Admin)")
            return True
        if user.has_group('ryc_student_disciplinary.group_disciplinary_admin'):
            _logger.info(f"Acceso permitido para {user.name} (Disciplinary Admin)")
            return True
        if user.has_group('ryc_student_disciplinary.group_disciplinary_profesor'):
            _logger.info(f"Acceso permitido para {user.name} (Profesor)")
            return True
        
        # Verificar si es tutor
        employee = request.env['hr.employee'].sudo().search([('user_id', '=', user.id)], limit=1)
        if employee:
            is_tutor = request.env['ryc.course.group'].sudo().search_count([('tutor_id', '=', employee.id)]) > 0
            if is_tutor:
                _logger.info(f"Acceso permitido para {user.name} (Tutor)")
                return True
            
        _logger.warning(f"Acceso denegado para {user.name}: No pertenece a grupos requeridos ni es tutor")
        return False

    @http.route('/student/disciplinary/new', auth='user', type='http', website=True)
    def new_disciplinary(self, **kw):
        """Mostrar formulario para registrar parte disciplinario"""
        user = request.env.user

        if not self._has_access(user):
            _logger.warning(f"Acceso denegado para usuario {user.name} - no tiene permisos suficientes")
            return request.render('disciplinary_web.disciplinary_unauthorized_page', {
                'error_message': f'Usuario {user.name} no tiene permisos para acceder a esta sección.',
                'json_dumps': json.dumps,
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

        return request.render('disciplinary_web.disciplinary_form_page', {
            'student': student,
            'json_dumps': json.dumps,
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
