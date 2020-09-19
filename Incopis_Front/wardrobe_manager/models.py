from django.db import models

class Brand(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Item(models.Model):
    description = models.TextField()
    serial_number = models.BigIntegerField()
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    price = models.FloatField()

    def is_cheaper(self, other_item):
        """ Check which item is cheaper"""
        return self.price < other_item.price

    def __str__(self):
        return "{desc} (From: {brand})".format(
            desc=self.description,
            brand=self.brand.name
        )

class Shopper(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    age = models.IntegerField()
    items = models.ManyToManyField(Item)

    def __str__(self):
        return self.name