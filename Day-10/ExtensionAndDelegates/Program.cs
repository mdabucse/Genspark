using System.Runtime.CompilerServices;
using ExtensionAndDelegates.Extensions;
using ExtensionAndDelegates.Delegates;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using ExtensionAndDelegates.LINQ;


// Extensions -> It does not access the private values

// Reverse String
string name = "Abu";
System.Console.WriteLine("The reversed string "+name.Reverse());

// IsEven 
int n = 10;
System.Console.WriteLine("Is this even "+n.IsEven());

// Sum of Even numbers in a List
List<int> arr = new List<int>{1,2,3,4,5};
System.Console.WriteLine("Sum of Even numbers in the list "+arr.EvenSum());

// Delegates - > Passing the funtion as a param (A type-safe function pointer)
OneDelegates Onemethod = new OneDelegates();
Onemethod.main();

// Multiple Delegates
MultipleDelegates Multimethod = new MultipleDelegates();
Multimethod.main();

// Types of Delegates

// Action (void delegate)
Action<string> print = Console.WriteLine;
print("Hello");

// Predicate (returns true or false)
Predicate<int> even = x =>(x%2==0);

// Func It returns other than bool type
Func<int,int,int> add = (a,b)=> a+b;

// LINQ Basic

LINQ examples = new LINQ();
examples.LINQExamples();

