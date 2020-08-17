from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic

from .models import Brand

def index(request):
    """
    This is the main page served in this app
    """
    return HttpResponse("HI!")

class BrandDetail(generic.DetailView):
    model = Brand
    template_name = 'wardrobe_manager/brand_page.html'

class AllBrandsView(generic.ListView):
    model = Brand
    template_name = 'wardrobe_manager/brands_list.html'

    def get_queryset(self):
        return Brand.objects.order_by('name')

def brand_rate(request, brand_id):
    return HttpResponseRedirect(reverse('wardrobe_manager:all_brands'))
