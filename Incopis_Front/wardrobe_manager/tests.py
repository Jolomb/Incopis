from django.test import TestCase
from .models import Item, Brand

class ItemModelTests(TestCase):
    """
    Class for testing the Item model in our DB
    """

    def test_price_order_operator(self):
        """
        Check price ordering works as expected
        """
        fake_brand = Brand('MyBrand')
        cheap = Item(description="Cheaper Item", serial_number=123, brand=fake_brand, price=4.3)
        expensive = Item(description="Expensive Item", serial_number=124, brand=fake_brand, price=9.7)
        self.assertIs(cheap.is_cheaper(expensive), True)
