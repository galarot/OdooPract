import base64, json
from odoo import http
from odoo.http import request, route, Response

class OwlPlayground(http.Controller):
    @http.route(['/wp-bolsaprof/new'], type='http', auth='public')
    def show_playground(self):
        """
        Renders the owl playground pageEEssss
        """
        return request.render('awesome_owl.playground')

    @http.route('/recruitment/titulaciones', type='json', auth='public')
    def get_titulaciones(self):
        return request.env['hr.recruitment.titulaciones'].sudo().search_read([
            ('area.mostrar', '=', True)
        ])

    @http.route('/public/create_applicant', type='http', auth='public', methods=['POST'], csrf=False)
    def create_applicant(self, **post):

        try:
            # 🔴 FORM DATA (NO JSON)
            job_id = int(request.httprequest.form.get("job_id"))
            name = request.httprequest.form.get("name")
            email = request.httprequest.form.get("email_from")
            titulacion = request.httprequest.form.get("titulacion")
            fecha_expedicion = request.httprequest.form.get("fecha_expedicion") or False
            posesion_cap_maes = request.httprequest.form.get("posesion_cap_maes")
            ma_titulacion_exigida = request.httprequest.form.get("ma_titulacion_exigida")
            ma_expediente_academico = request.httprequest.form.get("ma_expediente_academico")
            ma_td_doctor = request.httprequest.form.get("ma_td_doctor")
            ma_td_si = request.httprequest.form.get("ma_td_si")
            ma_td_otra_lic = request.httprequest.form.get("ma_td_otra_lic")
            ma_td_otra_dip = request.httprequest.form.get("ma_td_otra_dip")
            ma_td_cfgs = request.httprequest.form.get("ma_td_cfgs")
            ingles = request.httprequest.form.get("ingles")
            frances = request.httprequest.form.get("frances")
            cursos_realizados = request.httprequest.form.get("cursos_realizados")
            ed_meses_trabajados_tear = request.httprequest.form.get("ed_meses_trabajados_tear")
            ed_meses_trabajados_er = request.httprequest.form.get("ed_meses_trabajados_er")

            applicant = request.env['hr.applicant'].sudo().create({
                'name': name,
                'partner_name': name,
                'email_from': email,
                'titulacion': titulacion,
                'fecha_expedicion': fecha_expedicion,
                'ma_titulacion_exigida': ma_titulacion_exigida,
                'ma_expediente_academico': ma_expediente_academico,
                'posesion_cap_maes': posesion_cap_maes,
                'ma_td_doctor' : ma_td_doctor,
                'ma_td_si' : ma_td_si,
                'ma_td_otra_lic' : ma_td_otra_lic,
                'ma_td_otra_dip' : ma_td_otra_dip,
                'ma_td_cfgs' : ma_td_cfgs,
                'ingles' : ingles,
                'frances' : frances,
                'cursos_realizados' : cursos_realizados,
                'ed_meses_trabajados_tear' : ed_meses_trabajados_tear,
                'ed_meses_trabajados_er' : ed_meses_trabajados_er,
                'job_id': job_id,
                'stage_id': 1,
            })

            files = request.httprequest.files.getlist('files')

            for file in files:
                content = file.read()

                if not content:
                    continue

                request.env['ir.attachment'].sudo().create({
                    'name': file.filename,
                    'type': 'binary',
                    'datas': base64.b64encode(content),
                    'res_model': 'hr.applicant',
                    'res_id': applicant.id,
                    'mimetype': file.mimetype,
                })

            return Response(json.dumps({
                "success": True,
                "email" : email,
                "id": applicant.id,
                "redirect_url": '/solicitud-ok'
            }), content_type="application/json")

        except Exception as e:
            return Response(json.dumps({
                "success": False,
                "error": str(e)
            }), content_type="application/json")

    @http.route('/solicitud-ok', type='http', auth='public', website=True)
    def solicitud_ok(self, **kw):
        email = kw.get('email', '')
        return request.render('awesome_owl.solicitud-ok', {
            'email': email
        })