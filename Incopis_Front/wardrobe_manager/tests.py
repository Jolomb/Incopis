from django.test import TestCase
from django.urls import reverse

from django.contrib.staticfiles.testing import LiveServerTestCase
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.firefox.options import Options

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

class AllBrandsLiveViewTest(LiveServerTestCase):
    fixtures = []

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        options = Options()
        options.headless = True
        cls.selenium = WebDriver(options=options)
        cls.selenium.implicitly_wait(10)

    @classmethod
    def tearDownClass(cls):
        cls.selenium.quit()
        super().tearDownClass()

    def test_list(self):
        Brand.objects.create(name="MyBrand")
        self.selenium.get('%s%s' % (self.live_server_url, '/wardrobe_manager/brand/'))
        element = self.selenium.find_element_by_link_text("MyBrand")
        self.assertTrue(element.is_displayed())

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