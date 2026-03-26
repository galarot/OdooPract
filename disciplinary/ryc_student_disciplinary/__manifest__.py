{
    'name': 'Disciplinary',
    'version': '1.0',
    'depends': [
        'base',
    ],
    'data': [
        'data/ryc_student_sequence.xml',
        'security/ir.model.access.csv',
        'views/ryc_student_views.xml',
        'views/ryc_course_level_views.xml',
        'views/ryc_course_group_views.xml',
        'views/ryc_course_views.xml',
        'views/ryc_student_disciplinary_menus.xml',
    ],
    'application': True,
    'installable': True,
    'license': 'LGPL-3',
}
