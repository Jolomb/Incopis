package main

import (
	"fmt"
	"net"
)

func main() {
	fmt.Println("Hello World!")
	var name string = "www.cnn.com"
	addr ,_ := net.ResolveIPAddr("ip", name)
	fmt.Println("Resolved ", name, " TO: ", addr.String())

}
