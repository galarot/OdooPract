# -*- coding: utf-8 -*-
{
    'name': "Awesome Owl Test",
    'summary': """
        Starting module for "Discover the JS framework, chapter 1: Owl components"
    """,
    'description': """
        Starting module for "Discover the JS framework, chapter 1: Owl components"
    """,
    'author': "Mantenimiento Informático",
    'website': "https://www.odoo.com",
    'category': 'Tutorials/AwesomeOwl',
    'version': '17.0.1.0.0',
    'depends': ['base', 'web', 'mail', 'hr', 'hr_recruitment',],
    'application': True,
    'installable': True,
    'data': [
        'views/templates.xml',
        'views/mail_template_data.xml'
    ],
    'assets': {
        'awesome_owl.assets_playground': [
            # bootstrap
            ('include', 'web._assets_helpers'),
            'web/static/src/scss/pre_variables.scss',
            'web/static/lib/bootstrap/scss/_variables.scss',
            ('include', 'web._assets_bootstrap_backend'),

            # required for fa icons
            'web/static/src/libs/fontawesome/css/font-awesome.css',
            
            # include base files from framework
            ('include', 'web._assets_core'),

            'web/static/src/core/utils/functions.js',
            'web/static/src/core/browser/browser.js',
            'web/static/src/core/registry.js',
            'web/static/src/core/assets.js',
            'awesome_owl/static/src/**/*',
        ],
    },
    'license': 'AGPL-3'
}
