[[main function | Before learning this part]]
## 1. Definition
In C, the integer returned by the `main` function is known as the **Exit Status** or **Exit Code**. It is the final message a program sends to the operating system or the parent process (Shell) upon termination.

## 2. How to Retrieve the Return Value
The method to view this value depends on your operating system and shell.

**Example Code:**
```c
int main() {
    return 42; // Arbitrary exit code
}
```

### Linux / macOS / Unix (Bash, Zsh)
Use the special variable **`$?`**. It holds the exit status of the **most recently executed** command.
```bash
$ ./app
$ echo $?
42
```
*Note: You must check `$?` immediately after the program runs. If you run another command (like `ls`), `$?` will update to the exit code of `ls`.*

### Windows (CMD)
Use the environment variable **`%ERRORLEVEL%`**.
```cmd
> app.exe
> echo %ERRORLEVEL%
42
```

### Windows (PowerShell)
Use the variable **`$LastExitCode`**.
```powershell
> ./app.exe
> echo $LastExitCode
42
```

## 3. Standard Conventions
While you can return any integer, there is a strict convention followed by the entire programming ecosystem (OS, Shells, Build Tools):

*   **`0` (Zero)**: Represents **Success**. The program finished without errors.
*   **Non-Zero**: Represents **Failure**.
    *   `1` is typically a generic error.
    *   Specific numbers can indicate specific error types (e.g., File Not Found).

**Best Practice:**
Use macros from `<stdlib.h>` for readability:
*   `EXIT_SUCCESS` (Usually 0)
*   `EXIT_FAILURE` (Usually 1)

```c
#include <stdlib.h>
int main() {
    if (error_detected) {
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
```

## 4. Practical Usage: Automation & Logic
The real power of exit codes lies in automation. Shells use them to decide control flow.

### A. Logical Operators
[[Short-Circuit Evaluation 短路运算]]
*   **`&&` (AND Operator)**
    *   **Logic:** Run the next command **only if** the previous one succeeded (returned 0).
    *   **Usage:** `gcc main.c -o app && ./app`
    *   *Effect:* The program runs only if compilation is successful.

*   **`||` (OR Operator)**
    *   **Logic:** Run the next command **only if** the previous one failed (returned non-zero).
    *   **Usage:** `./app || echo "Program Crashed!"`
    *   *Effect:* Prints an error message only if the program fails.

### B. Shell Scripting
You can write scripts to handle errors gracefully based on return values.
```bash
#!/bin/bash
./app

if [ $? -eq 0 ]; then
    echo "Task completed successfully."
else
    echo "Task failed with error code $?."
    exit 1
fi
```

### C. CI/CD Pipelines
Build systems (Jenkins, GitHub Actions, GitLab CI) rely entirely on exit codes. If your test suite returns a non-zero value, the build pipeline is marked as **Failed**.

## 5. Important Limitation: The 8-bit Range
On Unix/Linux systems, the parent process only retrieves the **lower 8 bits** of the return value.

*   **Range:** 0 to 255.
*   **The Trap:** If you `return 256;`
    *   Binary: `1 0000 0000`
    *   Lower 8 bits: `0000 0000` (which is 0)
    *   **Result:** The system thinks the program **succeeded** (0), even though you intended to report a high-value error.
*   **Recommendation:** Always keep custom exit codes between 0 and 255.