from django.contrib import admin
from .models import Brand, Item, Shopper

# Register your models here.
admin.site.register(Brand)
admin.site.register(Item)
admin.site.register(Shopper)