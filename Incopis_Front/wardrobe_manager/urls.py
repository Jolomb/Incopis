from django.conf import settings
from django.views.decorators.cache import cache_page
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.urls import path
from . import views

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

app_name = 'wardrobe_manager'
urlpatterns = [
    path('', views.index, name='index'),
    path('brand/<int:pk>/', cache_page(CACHE_TTL)(views.BrandDetail.as_view()), name='brand_details'),
    path('brand/<int:brand_id>/rating', views.brand_rate, name='brand_rate'),
    path('brand/', views.AllBrandsView.as_view(), name='all_brands')
]
