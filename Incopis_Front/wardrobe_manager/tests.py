from django.test import TestCase
from .models import Item, Brand
from django.urls import reverse

import random

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

class AllBrandsViewTest(TestCase):
    """
    Perform tests on the view that shows all possible brands
    """

    def test_no_brands(self):
        """
        Test the case where there are no brands in the DB at all
        """
        response = self.client.get(reverse('wardrobe_manager:all_brands'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Brand list is empty?!')
        self.assertQuerysetEqual(response.context['brand_list'], [])
    
    def test_two_brands_ordered(self):
        """
        Test that 2 brands inserted into the DB do show correctly and ordered right
        """
        Brand.objects.create(name='D')
        Brand.objects.create(name='A')
        response = self.client.get(reverse('wardrobe_manager:all_brands'))
        self.assertQuerysetEqual(response.context['brand_list'],  \
                            ['<Brand: A>', '<Brand: D>'])