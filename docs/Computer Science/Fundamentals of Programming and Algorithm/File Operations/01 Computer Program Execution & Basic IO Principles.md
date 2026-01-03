## 1. Principles of Program Execution

### From Code to Process
A compiled C program (e.g., `app.exe` or `a.out`) stored on the hard drive is merely a static sequence of binary instructions and data. It is considered "dead" until executed. The transition from a static file to a running entity involves the following steps:

1.  **Loading (Load to RAM):**
    The Operating System (OS) copies the program's code and data from the slow storage device (Hard Disk/SSD) into the high-speed Random Access Memory (RAM).
2.  **Resource Allocation:**
    The OS creates a **Process** structure to manage the program. Key resources assigned include:
    *   **PID (Process ID):** A unique numerical identifier.
    *   **Memory Segments:**
        *   **Code Segment:** Stores machine instructions.
        *   **Data Segment:** Stores global/static variables.
        *   **Stack:** Stores local variables and function call frames.
        *   **Heap:** Stores dynamically allocated memory (via `malloc`).
    *   **File Descriptors:** The OS automatically opens standard streams (stdin, stdout, stderr).
3.  **CPU Execution:**
    The OS sets the CPU's Instruction Pointer to the entry point of the program (usually `main`). The CPU begins the **Fetch-Decode-Execute** cycle.

### The Shell
The Shell acts as the interface between the user and the Operating System Kernel.
*   **Kernel:** The core of the OS, managing hardware resources (CPU, Memory, I/O). Direct access is restricted for safety.
*   **Shell:** A command-line interpreter (e.g., Bash, Zsh, PowerShell). It parses user commands and invokes **System Calls** (like `fork` and `exec`) to launch programs.

### Types of Applications
*   **Console Applications (CLI):** Text-based interface, sequential execution, relies heavily on Standard I/O. (The focus of C file operations).
*   **GUI Applications:** Event-driven, uses message loops to respond to user interactions (mouse/keyboard events).
*   **Daemons/Services:** Background processes with no user interface, usually detached from standard input/output.

---

## 2. Standard Streams

In C (and Unix-like systems), Input/Output is abstracted as **Streams**. A stream is a sequence of bytes flowing into or out of a program.

When a program starts, the OS automatically opens three distinct streams. These correspond to specific **File Descriptors (FD)** in the underlying system.

| Stream Name | C Pointer | File Descriptor (FD) | Default Device | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| **Standard Input** | `stdin` | **0** | Keyboard | Reading input data |
| **Standard Output** | `stdout` | **1** | Terminal Screen | Printing normal results |
| **Standard Error** | `stderr` | **2** | Terminal Screen | Printing error messages/logs |

*Note: The C program handles these streams just like files. `stdin` and `stdout` are buffered (usually line-buffered), while `stderr` is typically unbuffered to ensure errors appear immediately.*

---

## 3. I/O Redirection

Redirection is a mechanism provided by the Shell to change the source or destination of the standard streams *before* the program executes. The C program is unaware of this change; it continues to read from `stdin` or write to `stdout` transparently.

### Output Redirection
Redirects data meant for the screen to a file.
*   **Overwrite Mode (`>`):**
    *   Syntax: `./app > output.txt`
    *   Behavior: If the file exists, it is truncated (cleared) before writing. If not, it is created.
*   **Append Mode (`>>`):**
    *   Syntax: `./app >> output.txt`
    *   Behavior: New data is added to the end of the existing file without erasing old content.

### Input Redirection
Feeds data from a file into the program instead of the keyboard.
*   **Syntax:** `./app < input.txt`
*   **Behavior:** The program's `scanf` or `getchar` functions read data from the file until End-Of-File (EOF) is reached.

### Error Redirection
Separates error messages from normal output.
*   **Syntax:** `./app 2> error.log`
*   **Mechanism:** Redirects File Descriptor 2 (stderr) specifically. This allows clean output in the terminal while preserving logs in a file.
*   **Combined:** `./app > result.txt 2> error.log` (Splits output and errors into different files).

### Underlying Mechanism (Dup2)
The operating system implements redirection using the `dup2` system call. For example, output redirection involves closing FD 1 (stdout) and replacing it with the FD of the opened target file.

---

## 4. Pipes

A Pipe connects the output of one process directly to the input of another process. It is a fundamental concept in Inter-Process Communication (IPC) and the Unix philosophy ("Chain small tools to do complex tasks").

### The Pipe Operator (`|`)
*   **Syntax:** `command_A | command_B`
*   **Flow:** `stdout` of `command_A` $\rightarrow$ **Pipe Buffer** $\rightarrow$ `stdin` of `command_B`.
*   **Example:** `ls | grep ".c"`
    *   `ls` lists files to stdout.
    *   The pipe captures this output.
    *   `grep` reads the file list from its stdin and filters for lines containing ".c".

### Technical Characteristics
*   **In-Memory:** Pipes use a kernel memory buffer, not disk files, making data transfer very fast.
*   **Unidirectional:** Data flows one way (from left to right in the shell).
*   **Synchronization:** If the writer (Command A) is faster than the reader (Command B), the kernel blocks A until B catches up, and vice versa.