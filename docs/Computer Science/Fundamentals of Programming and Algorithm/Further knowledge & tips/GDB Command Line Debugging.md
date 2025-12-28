## 1. Core Concepts and Principles

### What is GDB?
GDB (GNU Debugger) is the standard debugging tool for Linux systems. If a running program is a movie, the compiler is the camera, the OS is the projector, and GDB is the **remote control**. It allows you to pause the program, play it line-by-line, modify variables, and inspect memory states.

### Key Compilation Flag: -g
*   **Function**: Tells the compiler to embed the "Symbol Table" (line numbers, variable names, etc.) into the executable file.
*   **Consequence**: Without `-g`, GDB can only show assembly instructions and cannot link back to the C source code.

### Breakpoint Mechanism
*   **Where does it stop?** A breakpoint pauses the program at the exact moment **before** the target line is executed.
*   **State**: Code prior to this line has completed execution (memory is updated); the instruction and assignment on the current line have not happened yet.

---

## 2. Recommended Project Structure & Compilation

To keep the engineering environment clean, it is recommended to separate source code from compilation artifacts.

### Directory Structure
```text
project/
├── src/          # Stores .c source files
│   └── main.c
├── build/        # Stores compiled executables
└── Makefile      # Automation script
```

### Compilation Command
```bash
# The -g flag is mandatory for debugging
gcc src/main.c -g -o build/main
```

### Starting the Debugger
```bash
gdb build/main
```

---

## 3. Core GDB Commands

### Breakpoint Settings
*   `break main` (short: `b main`): Pause at the entry of the main function.
*   `break 12` (short: `b 12`): Pause at line 12 of the current file.
*   `info break` (short: `i b`): List all current breakpoints and their IDs.
*   `delete 1` (short: `d 1`): Delete the breakpoint with ID 1.

### Execution Control
*   `run` (short: `r`): **Cold Start**. Starts the program from the beginning. To pass arguments, use `r arg1 arg2`.
*   `continue` (short: `c`): **Resume**. Runs at full speed until the next breakpoint or program termination.

### Stepping (The Critical Distinctions)
*   `next` (short: `n`): **Step Over**. Executes the current line. If the line contains a function call, it executes the entire function without entering it and stops at the next line.
*   `step` (short: `s`): **Step Into**. Executes the current line. If the line contains a function call, it enters the function and stops at the first line inside.
*   `finish`: **Step Out**. Executes the rest of the current function and returns to the caller (useful if you accidentally stepped into a function).

### Variables and Data Inspection
*   `print var` (short: `p var`): **Inspect Once**. Prints the current value of variable `var`.
*   `display var`: **Continuous Watch**. Automatically prints the value of `var` every time the program pauses.
*   `info locals`: Displays values of all local variables in the current stack frame.

### Stack Backtrace
*   `backtrace` (short: `bt`): **Call Stack**. Shows the execution path "how did I get here" (e.g., `main` -> `funcA` -> `funcB`). This is the first command to run when analyzing a **Segmentation Fault** (crash).

### Exit
*   `quit` (short: `q`): Exits GDB.

---

## 4. Advanced Skills: TUI Mode & Makefile

### Using TUI (Text User Interface)
Splits the terminal to show source code alongside the command line.
*   **Activation**:Outside GDB, use `gdb -tui program_path` Inside GDB, press `Ctrl + X` followed by `A`; or type the command `layout src`.
*   **Interface**: The upper half shows syntax-highlighted source code; the lower half is for commands.
*   **Glitch Fix**: If the screen display gets messed up, press `Ctrl + L` to refresh.

### Automation (Makefile)
Create a file named `Makefile` in the project root to simplify commands.

```makefile
CC = gcc
CFLAGS = -g -Wall
TARGET = build/main
SRC = src/main.c

all: $(TARGET)

$(TARGET): $(SRC)
	@mkdir -p build
	$(CC) $(CFLAGS) $(SRC) -o $(TARGET)

debug: $(TARGET)
	gdb $(TARGET)

clean:
	rm -rf build
```

**Workflow with Makefile:**
1.  Type `make` to compile.
2.  Type `make debug` to compile and enter GDB automatically.

---

## 5. Minimalist Workflow Summary (Cheat Sheet)

1.  **Edit**: Modify code in VS Code -> `Ctrl+S`.
2.  **Compile**: Type `make` (or the gcc command) in the terminal.
3.  **Debug**: Type `gdb build/main` in the terminal.
4.  **GDB Operations**:
    *   `b main` (Set breakpoint)
    *   `r` (Run)
    *   `Ctrl+X, A` (View source code)
    *   `n` (Step Over) / `s` (Step Into)
    *   `p x` (Inspect variable)
    *   `bt` (Check stack if crashed)
    *   `q` (Quit)