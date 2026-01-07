#### assignment & dereference
```c
int a[10];
int *p = a; // a degrades into a pointer pointing to a[0]
```
`*(p+1)` is equal to `p[1]` & `a[1]`
- but if p does not point to a continuous part of memory, `*(p+1)` & `p[1]` are undefined.
- `*(p+1)` equals to `p[1]` is always correct. `p[1]` equals to `a[1]` because `*p` (which is `p[0]`) equals to `a[0]`. If `int *p = a + 1`, `p[1]` equals to `a[2]`.

#### calculation
- a pointer `+`, `+=`, `-`, `-=` an integer are all valid.
- `++` & `--` are also valid.
- `p1 - p2`, where `p1` and `p2` are both pointers, is valid, and is called **Pointer subtraction**, used to calculate the offset between two pointers. Subtracting two pointers results in a value of type `ptrdiff_t` , which is the **signed** distance (**measured in elements**) between them.(Types of the two pointers should be the same.)
	If the actual difference between the two addresses is needed, we can cast the pointer to `int` or `char *`.