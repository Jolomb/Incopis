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

class CreateItem(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        brand_id = graphene.ID(required=True)
        description = graphene.String(required=True)
        price = graphene.Float(required=True)
        serial_number = graphene.Int(required=True)

    def mutate(self, info, brand_id, description, price, serial_number):
        try:
            brand = Brand.objects.get(pk=brand_id)
        except Brand.DoesNotExist:
            return None

        item = Item(description=description, price=price, serial_number=serial_number, brand=brand)
        item.save()
        return CreateItem(
            id=item.id
        )


class Mutation(graphene.ObjectType):
    create_brand = CreateBrand.Field()
    create_item = CreateItem.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
