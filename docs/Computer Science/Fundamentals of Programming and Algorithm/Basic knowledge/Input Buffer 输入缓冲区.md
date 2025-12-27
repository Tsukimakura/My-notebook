#### 1. Basic Concepts
##### 1.1 What is an Input Buffer? 

- **Definition**: A temporary storage area in memory that holds input data before it's processed by the program
    
- **Purpose**: Improves I/O efficiency by handling data in chunks rather than character-by-character

##### 1.2 Buffer Types

```text
Three types of buffering:

1. Fully Buffered (全缓冲) - Data flushed when buffer is full
2. Line Buffered (行缓冲) - Data flushed when newline encountered
3. Unbuffered (无缓冲) - Immediate I/O operation
```
- **stdin** is typically line-buffered (标准输入通常是行缓冲)

#### 2. How Input Buffer Works

##### Data Flow

```text
Keyboard Input → Input Buffer → Program Reading
```

#### 3. Common Buffer Problems 常见缓冲区问题

##### 3.1 Newline Character Issues 换行符问题

```c
// Problem: Mixing numeric and character input
int age;
char grade;

printf("Enter age: ");
scanf("%d", &age);        // Input: 18\n

printf("Enter grade: ");
scanf("%c", &grade);      // Reads '\n' instead of waiting
```
##### 3.2 Buffer Overflow 缓冲区溢出

```c
char name[10];
scanf("%s", name);        // Risk: User might input more than 9 characters
```
##### 3.3 Partial Read Issues 部分读取问题

```c
int a, b;
// User inputs: "10 abc"
scanf("%d %d", &a, &b);   // Only '10' is read successfully
```

#### 4. Solutions and Best Practices 解决方案

**Clearing Input Buffer**

```c
// Method 1: Simple buffer clearing function
void clear_input_buffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

// Method 2: Using space before %c
scanf(" %c", &ch);        // Space skips whitespace characters
```

#### 5. Memory Diagram 内存图示

```text
Input Buffer State:
Initial: [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]  (Empty)

User types "Hello" + Enter: 
Buffer: ['H']['e']['l']['l']['o']['\n'][ ][ ][ ][ ]

After fgets(buffer, 10, stdin):
Buffer: [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]  (Cleared)
```