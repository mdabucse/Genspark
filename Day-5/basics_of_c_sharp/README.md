# C# Basics

## Building Blocks of C#
* Assembly 
* Namespace
* Complex types (5 types)
* Memebers (3 types)
* Logic 

### Assembly 
* Is an compiled output for our code
* Types
    * Based on Extension
        * EXE (Executable Project)
            * Runs as an application
        * DLL (Dynamic Link Library)
            * Used by other programs
    * Based on Storage Location
        * Private
            * It stored in the /bin stored
        * Public 
            * It stored on GAC(Global Assembly cache)

### Namespace
* To organize and group related classes, interfaces, and other types.
* Types 
    * Built in Namespaces
    * User Defined Namespaces


### Complex types
* Complex types (also called reference types) are data types that store references (addresses) instead of actual values.
* Types
    * Class
    * Interface
    * Enumeration
    * Delegates & Events
    * Structure

### Memebers (3 types)
* Special Member Functions
    * built-in functions provided by C#
        * Eg
            * Constructor
            * Destructor
            * Property getters/setters
* Instance Member Functions
    * These methods belong to an object (instance).
* Static Member Functions
    * These belong to the class itself, not to objects.

## Datatypes

| C# Keyword | .NET Type      | Description                |
| ---------- | -------------- | -------------------------- |
| bool       | System.Boolean | True / False               |
| byte       | System.Byte    | 0 to 255                   |
| sbyte      | System.SByte   | -128 to 127                |
| char       | System.Char    | Single character           |
| decimal    | System.Decimal | High precision (money)     |
| double     | System.Double  | High precision decimal     |
| float      | System.Single  | Low precision decimal      |
| int        | System.Int32   | Integer (most used)        |
| uint       | System.UInt32  | Positive integers only     |
| nint       | System.IntPtr  | Platform-specific integer  |
| nuint      | System.UIntPtr | Platform-specific unsigned |
| long       | System.Int64   | Large integers             |
| ulong      | System.UInt64  | Large positive integers    |
| short      | System.Int16   | Small integers             |
| ushort     | System.UInt16  | Small positive integers    |

## Variable Initialization
* Types
    * Compiletime Initialization
    * Runtime Initialization

## Type casting
* Convert one datatype to another datatype
    * Implicit Type Casting - (Compiler)
    * Explicit Type Casting - (Programmer)
