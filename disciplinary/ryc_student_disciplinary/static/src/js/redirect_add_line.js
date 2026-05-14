odoo.define('ryc_student_disciplinary.redirect_add_line', ['web.dom_ready'], function(require) {
    'use strict';

    $(document).ready(function() {
        console.log('Disciplinary redirect script loaded');

        function getStudentId($button) {
            const $form = $button.closest('.o_form_view');
            let studentId = $form.find('input[name="id"]').val();
            if (!studentId) {
                studentId = $form.find('.o_field_one2many[data-field="disciplinary_ids"] input[name="id"]').val();
            }
            if (!studentId) {
                studentId = $form.find('[data-field="id"] input').val() || $form.find('[data-name="id"] input').val();
            }
            if (!studentId) {
                const urlIdMatch = window.location.href.match(/(?:#|\?|&)id=(\d+)/);
                if (urlIdMatch) {
                    studentId = urlIdMatch[1];
                }
            }
            console.log('Student ID encontrado:', studentId);
            return studentId;
        }

        function interceptAddLineClicks() {
            console.log('Buscando botones Add a line...');

            // Buscar todos los campos one2many
            $('.o_field_one2many').each(function() {
                const $field = $(this);
                const fieldName = $field.attr('data-field') || $field.attr('data-name') || $field.attr('name');

                if (fieldName === 'disciplinary_ids') {
                    console.log('Encontrado campo disciplinary_ids');

                    // Buscar botones dentro de este campo
                    $field.find('a, button').each(function() {
                        const $button = $(this);
                        const buttonText = $button.text().trim();

                        // Verificar si es un botón "Add a line"
                        if (buttonText.includes('Add a line') || $button.hasClass('o_field_x2many_list_row_add')) {
                            console.log('Encontrado botón Add a line');

                            if ($button.hasClass('disciplinary-redirect-processed')) {
                                return;
                            }
                            $button.addClass('disciplinary-redirect-processed');

                            $button.off('click').on('click', function(ev) {
                                console.log('Clic en botón Add a line interceptado');
                                ev.preventDefault();
                                ev.stopPropagation();

                                const studentId = getStudentId($button);
                                if (studentId && studentId !== 'New' && !isNaN(studentId)) {
                                    console.log('Redirigiendo a:', `/student/disciplinary/new?student_id=${studentId}`);
                                    window.location.href = `/student/disciplinary/new?student_id=${studentId}`;
                                } else {
                                    alert('Primero debe guardar el estudiante antes de crear un parte disciplinario.');
                                }
                                return false;
                            });

                            // Cambiar apariencia del botón
                            $button.css('background-color', '#007bff');
                            $button.css('color', 'white');
                            $button.html('<i class="fa fa-plus"></i> Crear Parte Disciplinario');
                        }
                    });
                }
            });
        }

        // Ejecutar inmediatamente
        interceptAddLineClicks();

        // Re-ejecutar periódicamente
        setInterval(interceptAddLineClicks, 2000);

        // También ejecutar cuando cambie el DOM
        $(document).on('DOMNodeInserted', function(e) {
            if ($(e.target).hasClass('o_field_one2many') || $(e.target).find('.o_field_one2many').length > 0) {
                setTimeout(interceptAddLineClicks, 500);
            }
        });
    });
});