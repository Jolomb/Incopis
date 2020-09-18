package utils

import (
	"context"
	"fmt"
	"github.com/shurcooL/graphql"
)


func Query() {
	client := graphql.NewClient("http://127.0.0.1:8000/graphql/", nil)
	var query struct {
		AllBrands []struct {
			Name graphql.String
			Id graphql.ID
		}
	}
	err := client.Query(context.Background(), &query, nil)
	if err != nil {
		fmt.Println("Failed to fetch query: ", err)
	} else {
		for _, brand := range query.AllBrands {
			fmt.Println("Brand name: ", brand.Name)
		}
	}
}
