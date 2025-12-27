### 1. The Standard Prototype

To interact with the command line (Terminal/Shell), the main function is defined as:


```c
int main(int argc, char const *argv[])
```

### 2. Parameters Explained

#### **int argc (Argument Count)**

- **Definition:** The total count of string arguments passed to the program.
    
- **Key Detail:** It includes the name of the program itself.
    
- **Example:**
    
    - Command: ./demo hello world
        
    - Count: **3** (1: ./demo, 2: hello, 3: world)
        

#### **`char const *argv[]` (Argument Vector)**

- **Definition:** An array of strings (pointers to characters) containing the actual arguments.
    
- **Structure:**
    
    - `argv[0]`: The command used to start the program.
        
    - `argv[1]` to `argv[argc-1]`: The actual user inputs.
        
    - `argv[argc]`: Always NULL (marks the end of the array).
        

### 3. Deep Dive: The `argv[0]` Pitfall

The slide highlighted a specific behavior regarding **Unix Symbolic Links**.

- **Fact:** `argv[0]` is **not** necessarily the original name of the compiled binary file.
    
- **Reality:** `argv[0]` reflects **how the program was invoked** in the terminal.
    

#### **Scenario: Symbolic Links (Symlinks)**

1. **Original File:** You compile a program named tool.
    
2. **Create Link:** You create a symbolic link (shortcut) named linkname pointing to tool.
    
    - Command: `ln -s tool linkname`
        
3. **Execution:**
    
    - If you run ./tool: `argv[0]` is "./tool".
        
    - If you run ./linkname: `argv[0]` is "./linkname".
        

**Conclusion:** Even though the underlying executable code is identical, the program can detect which "name" the user called it by.

### 4. Real-World Application: "Multi-Call Binaries"

This feature is widely used in Linux system utilities (e.g., **BusyBox**).

- **How it works:**
    
    - There is only **one** real executable file (e.g., busybox).
        
    - Commands like ls, cp, rm are just symbolic links pointing to busybox.
        
- **Logic inside main():**

    ```c
    if (strcmp(argv[0], "./ls") == 0) {
        run_ls_logic();
    } else if (strcmp(argv[0], "./cp") == 0) {
        run_cp_logic();
    }
    ```
    
- **Benefit:** This saves disk space by bundling hundreds of tools into a single binary.