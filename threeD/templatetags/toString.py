from django import template

register = template.Library()

@register.filter
def toString(value):
    return str(value)