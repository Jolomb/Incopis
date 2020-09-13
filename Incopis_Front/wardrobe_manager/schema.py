import graphene
from graphene_django import DjangoObjectType

from .models import Brand, Item

class BrandType(DjangoObjectType):
    class Meta:
        model = Brand
        fields = ("id", "name")

class ItemType(DjangoObjectType):
    class Meta:
        model = Item
        fields = ("id", "description", "serial_number", "brand", "price")

class Query(graphene.ObjectType):
    all_brands = graphene.List(BrandType)
    all_items = graphene.List(ItemType)
    brand_by_name = graphene.Field(BrandType, name=graphene.String(required=True))
    items_by_brand = graphene.List(ItemType, brand_id=graphene.ID(required=True), max_price=graphene.Int(required=False))

    def resolve_all_brands(self, info):
        return Brand.objects.all()

    def resolve_all_items(self, info):
        return Item.objects.all()

    def resolve_brand_by_name(self, info, name):
        try:
            return Brand.objects.get(name=name)
        except Brand.DoesNotExist:
            return None

    def resolve_items_by_brand(self, info, brand_id, max_price=None):
        if max_price is not None:
            return Item.objects.filter(brand=brand_id, price__lte=max_price)
        else:
            return Item.objects.filter(brand=brand_id)
        

class CreateBrand(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()

    class Arguments:
        name = graphene.String()
   
    def mutate(self, info, name):
        brand = Brand(name=name)
        brand.save()

        return CreateBrand(
            id=brand.id,
            name=brand.name,
        )

class Mutation(graphene.ObjectType):
    create_brand = CreateBrand.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
