## 1. Core Concept
In C, the term **"Namespace"** does not refer to a distinct keyword or feature like in C++ or C# (e.g., `namespace MyLib { ... }`).

Instead, it refers to **Identifier Classification**. The C compiler categorizes identifiers into different "spaces." **Identifiers in different namespaces can share the same name within the same scope without conflict.**

## 2. The Four Classes of Namespaces
According to the ISO C Standard, identifiers fall into one of four categories:

### A. Label Name Space
*   **Content:** Labels used as targets for `goto` statements.
*   **Syntax:** Identified by a trailing colon (e.g., `error_handler:`).
*   **Characteristics:** These are the most independent. A label name can overlap with variables or functions in the same function.

### B. Tag Name Space
*   **Content:** The names (tags) following `struct`, `union`, and `enum`.
*   **Usage:** Must be preceded by the keyword (e.g., `struct Node`, `enum Color`).
*   **Example:**
    ```c
    struct Book { ... }; // "Book" is in the Tag Namespace
    ```

### C. Member Name Space
*   **Content:** Members (fields) inside a `struct` or `union`.
*   **Characteristics:**
    *   **Per-Structure Basis:** Every structure or union creates its own distinct namespace.
    *   `struct A` can have a member named `id`, and `struct B` can also have a member named `id`. They do not collide.

### D. Ordinary Identifiers (The "General" Namespace)
*   **Content:** This is the most crowded namespace. It includes:
    *   Variables
    *   Function names
    *   `typedef` names
    *   Enumeration constants (the values inside an enum, e.g., `RED`, `BLUE`)
*   **Constraint:** You cannot have a variable and a function with the same name in the same scope.

---

## 3. Intersection: Namespaces vs. Scope
[[Scope 作用域]]

It is crucial to understand that **Namespace** and **Scope** are orthogonal concepts.
*   **Scope** defines **where** (region) an identifier is visible.
*   **Namespace** defines **what kind** of identifier it is.

### Scenario 1: Same Scope, Different Namespace (Valid)
This is the basis for common C idioms.
```c
typedef struct Student { // "Student" (1): Tag Namespace
    int val;
} Student;               // "Student" (2): Ordinary Identifier (typedef)

void func() {
    struct Student s1;   // Refers to (1) via 'struct' keyword
    Student s2;          // Refers to (2) via typedef
}
```

### Scenario 2: Different Scope, Same Namespace (Shadowing)
If a name exists in the same namespace but in a nested scope, the inner one **shadows** the outer one.
```c
int count = 100; // Global scope

void func() {
    int count = 5; // Local scope shadows global 'count'
                   // Both are Ordinary Identifiers
}
```

### Scenario 3: Same Scope, Same Namespace (Collision)
This results in a compile-time error (Redefinition).
```c
void func() {
    int x;
    // double x;      // Error: 'x' already exists in Ordinary Namespace
    // typedef int x; // Error: typedefs also live in Ordinary Namespace
}
```

---

## 4. Best Practices: Simulating C++ Namespaces
Since C lacks a logical grouping feature for global identifiers, naming collisions in the **Ordinary Identifier** namespace are common in large projects (global pollution).

**The Solution:** Use explicit **Prefixing**.

| C++ Style | C Style (Convention) |
| :--- | :--- |
| `namespace Json { void parse(); }` | `void Json_parse();` |
| `namespace Gtk { class Window; }` | `struct GtkWindow;` |

### Summary Matrix

| Category     | Includes                                       | Example                           |
| :----------- | :--------------------------------------------- | :-------------------------------- |
| **Labels**   | `goto` targets                                 | `end:`                            |
| **Tags**     | `struct`/`union`/`enum` names                  | `struct Account`                  |
| **Members**  | Fields inside structs                          | `obj.balance`                     |
| **Ordinary** | Variables, Functions, Typedefs, Enum Constants | `int x`, `void init()`, `MAX_VAL` |