{
    'name': 'Disciplinary',
    'version': '1.0',
    'depends': [
        'base',
        'hr',
    ],
    'data': [
        'data/ryc_student_sequence.xml',
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/ryc_student_views.xml',
        'views/ryc_student_disciplinary_views.xml',
        'views/ryc_course_level_views.xml',
        'views/ryc_course_group_views.xml',
        'views/ryc_course_views.xml',
        'views/hr_employee_views.xml',
        'views/ryc_student_disciplinary_menus.xml',
    ],
    'application': True,
    'installable': True,
    'license': 'LGPL-3',
}
