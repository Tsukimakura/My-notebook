**The Setup:**

```
int num = 42;
int *p = &num;
```

**What happens in RAM:**

| Variable Name | Memory Address | Stored Value | Description                                             |
| ------------- | -------------- | ------------ | ------------------------------------------------------- |
| **num**       | 0x100          | **42**       | The actual data.                                        |
| **p**         | 0x204          | **0x100**    | The pointer. Notice its **value** is num's **address**. |

- **Direct Access:** If you ask for num, the CPU goes to 0x100 and reads 42.

- **Indirect Access (Pointer):** If you ask for *p, the CPU goes to 0x204, reads 0x100, realizes that is an address, goes to 0x100, and reads 42.

- when we move to a 64-bit system, the address gets longer (from 8 hexadecimal to 16 hexadecimal) , and accordingly , sizeof(p) turns from 4 to 8.[[sizeof(pointer)]]