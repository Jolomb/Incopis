from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic

from .models import Brand


# Create your views here.
def index(request):
    return HttpResponse("HI!")

class BrandDetail(generic.DetailView):
    model = Brand
    template_name = 'wardrobe_manager/brand_page.html'

class AllBrandsView(generic.ListView):
    model = Brand
    template_name = 'wardrobe_manager/brands_list.html'

def brand_rate(request, brand_id):
    return HttpResponseRedirect(reverse('wardrobe_manager:all_brands'))
