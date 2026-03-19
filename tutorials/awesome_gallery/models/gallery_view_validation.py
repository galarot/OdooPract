# -*- coding: utf-8 -*-
import logging
import os

from lxml import etree

from odoo.loglevels import ustr
from odoo.tools import misc, view_validation

_logger = logging.getLogger(__name__)

_gallery_validator = None


@view_validation.validate('gallery')
def schema_gallery(arch, model, env, **kwargs):
    """Check the gallery view against its schema and field validity."""
    global _gallery_validator

    if _gallery_validator is None:
        with misc.file_open(os.path.join('awesome_gallery', 'rng', 'gallery.rng')) as f:
            _gallery_validator = etree.RelaxNG(etree.parse(f))

    if not _gallery_validator.validate(arch):
        for error in _gallery_validator.error_log:
            _logger.error(ustr(error))
        return False

    # Validate that image_field and tooltip_field exist in the model
    if model and env:
        model_fields = env[model].fields_get()
        image_field = arch.get('image_field')
        tooltip_field = arch.get('tooltip_field')

        if image_field and image_field not in model_fields:
            _logger.error("Gallery view: image_field '%s' does not exist in model '%s'", image_field, model)
            return False

        if tooltip_field and tooltip_field not in model_fields:
            _logger.error("Gallery view: tooltip_field '%s' does not exist in model '%s'", tooltip_field, model)
            return False

    return True
