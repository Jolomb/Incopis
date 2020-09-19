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
}

type IncopisClient interface {
	GetAllBrands() ([]Brand, error)
	InitClient() error
	GetItemsByBrand(brandId graphql.ID) ([]Item, error)
}

type DebugClient struct {
	client_backend *graphql.Client
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
