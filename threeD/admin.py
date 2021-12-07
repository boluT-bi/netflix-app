from django.contrib import admin
from threeD.models import Clients,Profile


class ModelAdmin(admin.ModelAdmin):
    pass


admin.site.register(Clients,ModelAdmin)
admin.site.register(Profile,ModelAdmin)




# Register your models here.
