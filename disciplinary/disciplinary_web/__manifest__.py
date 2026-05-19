{
    'name': 'Disciplinary Web',
    'version': '1.0',
    'category': 'Education',
    'summary': 'Portal web para registrar partes disciplinarios',
    'depends': [
        'base',
        'web',
        'ryc_student_disciplinary',
    ],
    'data': [
        'templates/disciplinary_form.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'disciplinary_web/static/src/xml/disciplinary_form.xml',
            'disciplinary_web/static/src/js/disciplinary_form.js',
            'disciplinary_web/static/src/js/main.js',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}


