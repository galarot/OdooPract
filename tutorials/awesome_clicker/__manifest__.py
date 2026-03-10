# -*- coding: utf-8 -*-
{
    'name': "Awesome Clicker",

    'summary': """
        Starting module for "Master the Odoo web framework, chapter 1: Build a Clicker game"
    """,

    'description': """
        Starting module for "Master the Odoo web framework, chapter 1: Build a Clicker game"
    """,

    'author': "Odoo",
    'website': "https://www.odoo.com/",
    'category': 'Tutorials/AwesomeClicker',
    'version': '0.1',
    'application': True,
    'installable': True,
    'depends': ['base', 'web'],

    'data': [
        'views/menu.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'awesome_clicker/static/src/dummy_clicker_service.js',
            'awesome_clicker/static/src/utils.js',
            'awesome_clicker/static/src/click_rewards.js',
            'awesome_clicker/static/src/clicker_model.js',
            'awesome_clicker/static/src/clicker_service.js',
            'awesome_clicker/static/src/clicker_hook.js',
            'awesome_clicker/static/src/click_value/**/*',
            'awesome_clicker/static/src/clicker/**/*',
            'awesome_clicker/static/src/systray/**/*',
            'awesome_clicker/static/src/clicker_patch.js',
        ],
    },
    'license': 'AGPL-3'
}
