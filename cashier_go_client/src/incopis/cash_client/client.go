package main

import (
	"fmt"
	"incopis/utils"
	"net"
)

func main() {
	fmt.Println("Hello World!")
	var name string = "www.cnn.com"
	addr, _ := net.ResolveIPAddr("ip", name)
	fmt.Println("Resolved ", name, " TO: ", addr.String())

	utils.Query()
	brand, err := utils.QueryBrand("MyBrand2")
	if err != nil {
	} else{
		fmt.Println("Query brand success!: ", brand)
		utils.AddItem(brand.ID)	
	}

}
