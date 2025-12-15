**Algorithm**
1. **Enumeration 枚举**
	improvement: enumerate in descended order

2. **Euclid's algorithm**
	i ) gcd(x,0) = gcd(0,x) = x,and we can stop(or return);
	ii ) for A and B, if A = B·Q+R(Q is a positive integer),gcd(A,B) = gcd(B,R).

**Implementation in C**
1. Iteration 迭代实现（循环）
```c
int gcd(int a, int b){
	while(b != 0){
		int r = a % b;
		a = b;
		b = r;
		//if a<b, the value of a and b will be swaped.
	}
	return a;
}
```

2. Recursion （尾）递归实现
```c
int gcd(int a, int b){
	if(b == 0){
		return a;
	}else{
		return gcd(a,a%b);
	}
}
```