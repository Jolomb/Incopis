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

    def resolve_all_brands(self, info):
        return Brand.objects.all()

    def resolve_all_items(self, info):
        return Item.objects.all()

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
