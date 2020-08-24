import graphene
from graphene_django import DjangoObjectType

from .models import Brand

class BrandType(DjangoObjectType):
    class Meta:
        model = Brand

class Query(graphene.ObjectType):
    brands = graphene.List(BrandType)

    def resolve_brands(self, info):
        return Brand.objects.all()

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
