odoo.define('ryc_student_disciplinary.redirect_add_line', ['web.dom_ready'], function(require) {
    'use strict';

    $(document).ready(function() {
        console.log('Disciplinary redirect script loaded - Odoo version check');

        function getStudentId($button) {
            // Primero intentar obtener el ID desde la URL
            const urlIdMatch = window.location.href.match(/(?:#|\?|&)id=(\d+)/);
            if (urlIdMatch) {
                console.log('Student ID from URL:', urlIdMatch[1]);
                return urlIdMatch[1];
            }

            // Buscar en el formulario
            const $form = $button.closest('.o_form_view, .o_view_controller');
            let studentId = $form.find('input[name="id"]').val();
            if (!studentId) {
                studentId = $form.find('[data-field="id"] input').val();
            }
            if (!studentId) {
                studentId = $form.find('[name="id"]').val();
            }

            console.log('Student ID encontrado:', studentId);
            return studentId;
        }

        function interceptAddLineClicks() {
            // Estrategia: Buscar botones de añadir línea en campos de expedientes disciplinarios
            // Odoo 17 usa clases específicas y atributos data-field
            $('.o_field_x2many_list_row_add, .o_field_one2many .o_list_renderer .o_field_x2many_list_row_add').each(function() {
                const $button = $(this);
                
                // Verificar si pertenece al campo disciplinary_ids o contiene texto relacionado
                const isDisciplinaryField = $button.closest('[data-field="disciplinary_ids"]').length > 0 || 
                                          $button.attr('data-field') === 'disciplinary_ids';
                
                const buttonText = $button.text().trim().toLowerCase();
                const isAddLineText = buttonText.includes('add a line') || 
                                     buttonText.includes('add line') || 
                                     buttonText.includes('añadir una línea') || 
                                     buttonText.includes('añadir linea') ||
                                     buttonText.includes('crear parte');

                if (isDisciplinaryField || (isAddLineText && $button.closest('.o_notebook').length > 0)) {
                    if ($button.hasClass('disciplinary-redirect-processed')) {
                        return;
                    }
                    $button.addClass('disciplinary-redirect-processed');

                    $button.off('click').on('click', function(ev) {
                        ev.preventDefault();
                        ev.stopPropagation();

                        const studentId = getStudentId($button);
                        if (studentId && studentId !== 'New' && !isNaN(studentId)) {
                            window.location.href = `/student/disciplinary/new?student_id=${studentId}`;
                        } else {
                            alert('Primero debe guardar el registro del estudiante antes de crear un parte disciplinario.');
                        }
                        return false;
                    });

                    // Estilizar el botón para que destaque
                    $button.addClass('btn-primary').removeClass('btn-secondary');
                    $button.html('<i class="fa fa-plus me-1"></i> Crear Parte Disciplinario');
                }
            });
        }

        // Ejecutar inmediatamente
        interceptAddLineClicks();

        // Re-ejecutar periódicamente
        setInterval(interceptAddLineClicks, 1000);

        // Ejecutar cuando cambie el DOM (más específico)
        $(document).on('DOMNodeInserted DOMSubtreeModified', function(e) {
            if ($(e.target).is('a, button') || $(e.target).find('a, button').length > 0) {
                setTimeout(interceptAddLineClicks, 100);
            }
        });

        // También escuchar por cambios en el contenido
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const addedNodes = mutation.addedNodes;
                    for (let i = 0; i < addedNodes.length; i++) {
                        const node = addedNodes[i];
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if ($(node).is('a, button') || $(node).find('a, button').length > 0) {
                                setTimeout(interceptAddLineClicks, 100);
                                break;
                            }
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Script de redirección completamente inicializado');
    });
});