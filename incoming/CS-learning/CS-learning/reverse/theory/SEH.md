**SEH（结构化异常处理）** 是 Windows 操作系统处理程序错误（如除零错、内存非法访问等）的一种机制。在逆向和脱壳中，它经常被用来进行反调试或控制程序执行流。

**1. 链表结构：** SEH 是一个**单向链表**，存在于当前线程的**堆栈（Stack）**中。 操作系统通过一个特殊的寄存器段 `FS:[0]` （在 32 位系统下指向 TIB，Thread Information Block）来找到这个链表的头部。

**2. 节点构成：** SEH 链表的每一个节点（结构体 `EXCEPTION_REGISTRATION_RECORD`）只有两个指针，占 8 个字节：

- **Next 指针：** 指向下一个异常处理节点的地址（如果到了链表尾部，这个值为 `0xFFFFFFFF`）。
    
- **Handler 指针：** 指向**异常处理函数**的真实内存地址。
    

**3. 运行机制：** 当程序发生异常崩溃时，Windows 不会立刻报错，而是顺着 `FS:[0]` 找到 SEH 链表：

- 系统先调用第一个节点的 Handler 函数，问它：“你能处理这个异常吗？”
    
- 如果不能，系统就顺着 Next 指针找第二个节点，继续问。
    
- 以此类推，直到找到能处理该异常的函数，或者到达系统默认的“最后防线”（弹出“程序已停止工作”对话框）。

```c
typedef struct _EXCEPTION_REGISTRATION_RECORD {
    struct _EXCEPTION_REGISTRATION_RECORD *Next;  // 位于基址 + 0x00
    PEXCEPTION_ROUTINE Handler;                   // 位于基址 + 0x04
} EXCEPTION_REGISTRATION_RECORD, *PEXCEPTION_REGISTRATION_RECORD;
```
