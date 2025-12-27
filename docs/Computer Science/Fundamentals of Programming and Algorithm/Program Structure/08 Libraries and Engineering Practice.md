## 1. Static Libraries (.a / .lib)

### Definition
A static library (typically `.a` on Linux, `.lib` on Windows) is an **archive file** that bundles multiple relocatable object files (`.o` or `.obj`) into a single file. It acts like a "container" or "storage bag" for `.o` files.

### Creation (using `ar` on Linux)
The `ar` (archiver) utility is used to create and manage static libraries.
```bash
# Compile source files into object files
gcc -c add.c -o add.o
gcc -c sub.c -o sub.o

# Create the static library libmymath.a from object files
ar rcs libmymath.a add.o sub.o
```
*   `r`: Replace or insert files.
*   `c`: Create the archive.
*   `s`: Create a symbol table index (essential for linker efficiency).

### Linker's Usage: "Extract-on-Demand"
When linking with a static library, the linker does **not** copy the entire library into your executable.
1.  The linker consults the library's **symbol index**.
2.  It identifies only the `.o` files within the `.a` archive that define the currently **undefined symbols** needed by your program.
3.  Only those specific `.o` files are extracted and copied into your final executable. Unused `.o` files within the library are ignored.

### Advantages
*   **Ease of Distribution:** Provide one `.a` file and one `.h` file.
*   **Self-Contained Executables:** The final program has no runtime dependencies on external `.a` files. It can be run on any compatible system without needing the library present.
*   **Modular Compilation:** Changes to one source file in the library only require recompiling that specific `.o` and updating the `.a` file.

## 2. Dynamic Libraries (.so / .dll)

### Definition
A dynamic library (typically `.so` on Linux, `.dll` on Windows) is a file containing object code that multiple programs can use simultaneously at runtime.

### Linker's Usage: "Deferred Resolution"
When linking with a dynamic library, the linker **does not** copy the code.
1.  It resolves symbols by noting that they are defined in a specific dynamic library.
2.  The executable records which dynamic libraries it needs.
3.  At runtime, the operating system's **dynamic loader** (e.g., `ld-linux.so`) loads the actual library code into memory and patches the program's addresses.

### Advantages
*   **Reduced Executable Size:** Only references to the library are stored.
*   **Memory Efficiency:** Multiple programs can share a single copy of the library in memory.
*   **Easier Updates:** Update the library, and all programs using it automatically get the new version without recompilation.

## 3. Specifying and Finding Libraries

### Compile-Time (Linker) Search
When running `gcc` to create the executable.
1.  **`-l<name>` (Lowercase L):** Specifies the library by name (e.g., `-lm` for `libm.so` or `libm.a`).
    *   The linker automatically prepends `lib` and appends `.a` or `.so`.
2.  **`-L<path>` (Uppercase L):** Specifies additional directories where the linker should search for libraries (e.g., `-L/home/user/my_libs`).
3.  **`LIBRARY_PATH` Environment Variable:** A colon-separated list of directories for the linker to search (used by `ld`).
4.  **System Default Paths:** Hardcoded paths like `/lib`, `/usr/lib`, `/usr/local/lib`.

### Runtime (Dynamic Loader) Search
When running the compiled executable.
1.  **RPATH / RUNPATH:** Paths **hardcoded into the executable** during compilation using flags like `-Wl,-rpath=/my/app/lib`. (Highest priority).
2.  **`LD_LIBRARY_PATH` Environment Variable:** A colon-separated list of directories for the dynamic loader to search. (Useful for testing, but can cause system instability if set globally).
3.  **`/etc/ld.so.cache`:** A cache of library locations built from `/etc/ld.so.conf` (and `/etc/ld.so.conf.d/`). Updated by `sudo ldconfig`.
4.  **System Default Paths:** `/lib`, `/usr/lib`.

### Critical Rule: Link Order Matters!
The linker processes files from left to right.
*   **Correct Order:** `gcc my_program.c -lmy_library`
    *   `my_program.c` (caller) $\to$ `libmy_library` (callee).
*   **Incorrect Order (often leads to `undefined reference`):** `gcc -lmy_library my_program.c`
    *   The linker sees `libmy_library` first, may discard it if no immediate need, then finds `my_program.c` needing symbols from it.


## Headaches with Debugging Linker Errors
*   **`undefined reference to 'symbol'`:** The linker couldn't find the definition. Check `-l` flags, `-L` paths, and the linking order.
*   **`error while loading shared libraries: libxxx.so: cannot open...`:** Runtime error. The dynamic loader can't find the library. Check `LD_LIBRARY_PATH`, RPATH, or system installation.
*   **`ldd my_program`:** Use this command to see which dynamic libraries an executable depends on and where they are located at runtime.