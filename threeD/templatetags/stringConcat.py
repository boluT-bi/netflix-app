from django import template
import logging

logging.basicConfig(level =logging.DEBUG)

log = logging.getLogger(__name__)

register = template.Library()

@register.simple_tag
def stringConcat(*args):
    string = '' 
    for var in args:
        if var == args[-1]:
            string += '"%s"'% str(var)
            string += ' '
        else:
            string += str(var)
            string += ' '

    string += '%}'
    log.debug(string)
    
    return string