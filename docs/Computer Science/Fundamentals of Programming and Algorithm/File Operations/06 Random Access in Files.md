## 1. The Concept of File Positioning

By default, file I/O operations (like `fgetc`, `fscanf`) are **Sequential**. The file acts like a cassette tape: to read the 100th byte, you must first read (or skip) the preceding 99 bytes.

**Random Access** allows the program to jump directly to any byte location in the file, similar to moving the needle on a vinyl record or scrubbing through a video timeline. This is essential for:
*   Modifying specific records in a database.
*   Reading metadata located at the end of a file (e.g., ID3 tags in MP3s).
*   Indexing large binary datasets.

### The File Position Indicator
Inside the `FILE` structure, the system maintains a **File Position Indicator** (often called the "file cursor" or "pointer").
*   **Initial State:** Points to byte 0 (beginning) when opened (unless in Append mode).
*   **Automatic Advance:** Reading/Writing $N$ bytes automatically moves the indicator forward by $N$ positions.
*   **Manual Control:** Random access functions allow the programmer to explicitly manipulate this indicator.

---

## 2. Querying Current Position: `ftell`

This function reports the current location of the cursor.

*   **Prototype:** `long ftell(FILE *stream);`
*   **Return Value:**
    *   Returns the current offset in **bytes** relative to the beginning of the file.
    *   Returns `-1L` if an error occurs.
*   **Usage:** Useful for bookmarking a location to return to later.

---

## 3. Changing Current Position: `fseek`

This is the primary function for moving the cursor.

*   **Prototype:** `int fseek(FILE *stream, long offset, int whence);`
*   **Return Value:** Returns `0` on success, and a non-zero value on error.

### Parameters
1.  **`stream`:** The file pointer.
2.  **`offset`:** A `long` integer specifying how many bytes to move.
    *   **Positive:** Move forward (towards the end of the file).
    *   **Negative:** Move backward (towards the beginning).
    *   **Zero:** Stay at the reference point.
3.  **`whence` (The Origin):** Defines the reference point for the offset. The C standard defines three constants:

| Constant | Reference Point | Common Usage | Example |
| :--- | :--- | :--- | :--- |
| **`SEEK_SET`** | **Beginning of File** | Absolute positioning | `fseek(fp, 100, SEEK_SET)`<br>Jump to the 100th byte. |
| **`SEEK_CUR`** | **Current Position** | Relative jumping | `fseek(fp, -10, SEEK_CUR)`<br>Rewind 10 bytes. |
| **`SEEK_END`** | **End of File** | Reverse positioning | `fseek(fp, 0, SEEK_END)`<br>Jump to the very end.<br>`fseek(fp, -10, SEEK_END)`<br>Jump to the 10th byte from the end. |

### The `rewind` Function
*   **Prototype:** `void rewind(FILE *stream);`
*   **Function:** Sets the file position indicator to the beginning of the file.
*   **Equivalence:** It is roughly equivalent to `fseek(stream, 0L, SEEK_SET)`, but it also clears the error indicator for the stream.

---

## 4. Practical Application: Measuring File Size

Since standard C does not provide a direct `get_file_size()` function, `fseek` and `ftell` are commonly combined to calculate it.

**The Algorithm:**
1.  Save the current position (optional, but good practice).
2.  Jump to the end of the file (`SEEK_END`).
3.  Query the position (`ftell`) to get the total byte count.
4.  Jump back to the original position.

```c
long get_file_size(FILE *fp) {
    long current_pos = ftell(fp);   // 1. Save state
    if (fseek(fp, 0, SEEK_END) != 0) {
        return -1; // Error handling
    }
    
    long size = ftell(fp);          // 2. Measure
    
    fseek(fp, current_pos, SEEK_SET); // 3. Restore state
    return size;
}
```

---

## 5. Important Considerations & Limitations

### Binary vs. Text Mode
*   **Recommendation:** Random access should primarily be used with **Binary Files** (`"rb"`, `"wb"`).
*   **Text Mode Risk:** On Windows, the translation between `\n` (memory) and `\r\n` (disk) breaks the mapping between logical bytes and physical bytes.
    *   *Result:* `fseek` might land in the middle of a CR/LF pair, or `ftell` might report a value that doesn't correspond to the physical file size.

### The 2GB Limit
*   **Data Type:** `fseek` and `ftell` use `long` for offsets. On many 32-bit systems (and Windows), `long` is a 32-bit signed integer.
*   **Limit:** This limits addressable file sizes to $2^{31}-1$ bytes (approx. **2 Gigabytes**).
*   **Solution:** For large files (Large File Support - LFS), use system-specific 64-bit alternatives (e.g., `_fseeki64` on Windows or `fseeko` on Linux with correct compilation flags).