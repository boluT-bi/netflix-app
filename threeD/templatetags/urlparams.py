from django import template
from urllib.parse import urlencode

register = template.Library()

@register.simple_tag
def urlparams(*_,**kwargs):
    url_args = {k: v for k,v in kwargs.items() if not v is None}
    if url_args:
        return '?{}'.format(urlencode(url_args))
    return ''