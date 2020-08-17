from django.db import models

# Create your models here.
class Brand(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Item(models.Model):
    description = models.TextField()
    serial_number = models.BigIntegerField()
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
