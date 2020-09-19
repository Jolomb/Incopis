package utils

import (
	"context"
	"fmt"
	"github.com/shurcooL/graphql"
)

type Brand struct {
	Name graphql.String
	ID   graphql.ID
}

type ClientNoInitializedError struct {
}

func (e *ClientNoInitializedError) Error() string {
	return "Client not initialized yet!"
}	

type Item struct {
	Description graphql.String
	ID graphql.ID
	Price graphql.Float
	SerialNumber graphql.Int
	Brand struct {
		ID graphql.ID
	}
}

type IncopisClient interface {
	GetAllBrands() ([]Brand, error)
	InitClient() error
	GetItemsByBrand(brandId graphql.ID) ([]Item, error)
	AddItemToBrand(new_item Item) (graphql.ID, error)
	GetBrandByName(brand_name graphql.String) (*Brand, error)
}

type DebugClient struct {
	client_backend *graphql.Client
}

func (client *DebugClient) GetBrandByName(brand_name graphql.String) (*Brand, error) {
	if client.client_backend == nil {
		return nil, &ClientNoInitializedError{}
	}
	var query struct {
		BrandByName Brand `graphql:"brandByName(name: $name)"`
	}

	variables := map[string]interface{} {
		"name": brand_name,
	}

	err := client.client_backend.Query(context.Background(), &query, variables)
	if err != nil {
		fmt.Println("Failed to fetch query: ", err)
		return nil, err
	} else {
		return &query.BrandByName, nil
	}

}

func (client *DebugClient) AddItemToBrand(new_item Item) (graphql.ID, error) {
	if client.client_backend == nil {
		return nil, &ClientNoInitializedError{}
	}

	var mutation struct {
		CreateItem struct {
			Id graphql.ID
		} `graphql:"createItem(brandId: $b_id, description: $desc, price: $price, serialNumber: $serial)"`
	} 

	variables := map[string]interface{} {
		"b_id": graphql.ID(new_item.Brand.ID),
		"desc": new_item.Description,
		"price": new_item.Price,
		"serial": new_item.SerialNumber,
	}
	err := client.client_backend.Mutate(context.Background(), &mutation, variables)
	if err != nil {
		fmt.Println("Failed to insert a new item: ", err)
		return nil, err
	}

	return mutation.CreateItem.Id, nil
}

func (client *DebugClient) InitClient() error {
	client.client_backend = graphql.NewClient("http://127.0.0.1:8000/graphql/", nil)
	return nil
}

func (client *DebugClient) GetItemsByBrand(id graphql.ID) ([]Item, error) {
	if client.client_backend == nil {
		return nil, &ClientNoInitializedError{}
	}

	var query struct {
		ItemsByBrand []Item `graphql:"itemsByBrand(brandId: $id)"`
	}

	variables := map[string]interface{} {
		"id": graphql.ID(id),
	}

	err := client.client_backend.Query(context.Background(), &query, variables)
	if err != nil {
		fmt.Println("Failed to fetch query: ", err)
		return nil, err
	} else {
		return query.ItemsByBrand, nil
	}
}

func (client *DebugClient) GetAllBrands() ([]Brand, error) {
	if client.client_backend == nil {
		return nil, &ClientNoInitializedError{}
	}
	var query struct {
		AllBrands []Brand
	}

	err := client.client_backend.Query(context.Background(), &query, nil)
	if err != nil {
		fmt.Println("Failed to fetch query: ", err)
		return nil, err
	} else {
		return query.AllBrands, nil
	}
}

// Exported Functions 

func AddItem(brand_id graphql.ID) {
	var client DebugClient
	client.InitClient()

	var new_item Item = Item {
		Description: "My Mutated from GO Item",
		ID: graphql.ID(10000),
		Price: 3030.12,
		SerialNumber: 13131313,
	}
	new_item.Brand.ID = brand_id
	new_id, _ := client.AddItemToBrand(new_item)
	fmt.Println("Created a new item with ID: ", new_id)

}

func QueryBrand(name graphql.String) (*Brand) {
	var client DebugClient
	client.InitClient()

	brand, _ := client.GetBrandByName(name)
	return brand	
}

func Query() {
	var client DebugClient
	client.InitClient()
	brands, err := client.GetAllBrands()
	if err != nil {
		fmt.Println("Failed to fetch all brands: ", err)
	}

	for _, brand := range brands {
		fmt.Println("Brand name: ", brand.Name)
		items, _ := client.GetItemsByBrand(brand.ID)

		for _, item := range items {
			fmt.Println("Item: ", item.Description)
		}
	}
}
