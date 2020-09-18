package main

import (
	"fmt"

	"golang.org/x/tour/tree"
)

// Walk walks the tree t sending all values
// from the tree to the channel ch.
func Walk(t *tree.Tree, ch chan int) {
	if t.Left != nil {
		Walk(t.Left, ch)
	}

	ch <- t.Value

	if t.Right != nil {
		Walk(t.Right, ch)
	}
}

func WalkWrapper(t *tree.Tree, ch chan int) {
	Walk(t, ch)
	close(ch)
}

// Same determines whether the trees
// t1 and t2 contain the same values.
func Same(t1, t2 *tree.Tree) bool {
	ch_tree1 := make(chan int)
	ch_tree2 := make(chan int)
	go WalkWrapper(t1, ch_tree1)
	go WalkWrapper(t2, ch_tree2)

	for v1 := range ch_tree1 {
		v2 := <-ch_tree2
		if v1 != v2 {
			return false
		}
	}
	_, ok := <-ch_tree2
	if ok {
		return false
	}
	return true
}

func main() {
	fmt.Println(Same(tree.New(1), tree.New(2)))
}
