{
    'name': 'Awesome Owl',
    'version': '1.0',
    'category': 'Tutorial',
    'depends': ['web'],
    'data': [
        'views/menu.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'awesome_owl/static/src/utils.js',
            'awesome_owl/static/src/counter/counter.js',
            'awesome_owl/static/src/counter/counter.xml',
            'awesome_owl/static/src/card/card.js',
            'awesome_owl/static/src/card/card.xml',
            'awesome_owl/static/src/todo_list/todo_item.js',
            'awesome_owl/static/src/todo_list/todo_item.xml',
            'awesome_owl/static/src/todo_list/todo_list.js',
            'awesome_owl/static/src/todo_list/todo_list.xml',
            'awesome_owl/static/src/playground.js',
            'awesome_owl/static/src/playground.xml',
        ],
    },
    'installable': True,
    'application': True,
}
