# DSA and C# Learning Summary

## 1. Data Structures and Algorithms (DSA)

### Problems Practiced

#### Two Sum
- Problem: Find two indices such that their values add up to a target.
- Approach:
  - Use a hash map to store visited numbers.
  - Check if (target - current value) exists in the map.
- Complexity:
  - Time: O(n)
  - Space: O(n)

#### Longest Palindromic Substring
- Problem: Find the longest substring that is a palindrome.
- Approach:
  - Expand around center for each character.
  - Consider both odd and even length palindromes.
- Complexity:
  - Time: O(n^2)
  - Space: O(1)

#### Remove Element
- Problem: Remove all occurrences of a value in-place and return new length.
- Approach:
  - Use two-pointer technique.
  - Overwrite elements not equal to target.
- Complexity:
  - Time: O(n)
  - Space: O(1)

#### Jump Game II
- Problem: Find minimum number of jumps to reach the last index.
- Approach:
  - Use greedy strategy.
  - Track current range and farthest reachable index.
- Complexity:
  - Time: O(n)
  - Space: O(1)

---

## 2. C# Basics

### Core Concepts

#### System Namespace
- Provides fundamental classes and base functionality.
- Includes Console, String, Math, and other core utilities.
- Example:
  - `using System;`

#### Namespaces
- Used to organize code and avoid naming conflicts.
- Helps group related classes and functionalities.
- Can be user-defined or built-in.

---

## 3. Project and File Structure in C#

### File Types

#### File-Based Approach
- Individual `.cs` files.
- Each file typically contains one class or logic unit.
- Used for modular and maintainable code.

#### Project-Based Approach
- `.csproj` file defines the project configuration.
- Contains dependencies, build settings, and target framework.
- Multiple files are grouped into a single project.

---

## 4. Directives

### Using Directive
- Used to include namespaces in a file.
- Reduces the need for fully qualified names.
- Example:
  - `using System;`

### Other Common Directives
- `using static` → Access static members directly.
- `using alias` → Create shorthand for namespaces or types.

---

## 5. Key Takeaways

- Practiced core DSA problems focusing on arrays and greedy techniques.
- Learned efficient problem-solving approaches like hashing and two pointers.
- Understood basic C# structure including namespaces and system libraries.
- Differentiated between file-based and project-based development.
- Gained clarity on directives and their usage in organizing code.