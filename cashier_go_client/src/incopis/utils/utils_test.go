package utils

import "testing"

type test_val struct {
	in  int // The input value
	out int // The expected value
}

func Test(t *testing.T) {
	var tests = []test_val{
		{6, 12},
		{5, 10},
		{0, 0},
	}

	for _, test := range tests {
		got := UtilFunc(test.in)
		if got != test.out {
			t.Errorf("Failed test: UtilFunc(%d) expected %d but got %d",
				test.in, test.out, got)
		}
	}
}
