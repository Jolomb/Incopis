from django.urls import path
from . import views

app_name = 'wardrobe_manager'
urlpatterns = [
    path('', views.index, name='index'),
    path('brand/<int:pk>/', views.BrandDetail.as_view(), name='brand_details'),
    path('brand/<int:brand_id>/rating', views.brand_rate, name='brand_rate'),
    path('brand/', views.AllBrandsView.as_view(), name='all_brands')
]
