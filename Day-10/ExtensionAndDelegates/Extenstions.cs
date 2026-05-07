using System;
using System.Diagnostics.CodeAnalysis;

namespace ExtensionAndDelegates.Extensions
{
    // Reverse String
    public static class ExtensionsSpace
    {
        public static string Reverse(this string value)
        {
            char[] arr = value.ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }

        // Even Number or Not
        public static bool IsEven(this int n)
        {
            return (n % 2 == 0);
        }

        // With List
        public static int EvenSum(this List<int> arr)
        {
            int sum = 0;
            foreach(var i in arr)
            {
                if(i.IsEven())sum+=i;
            }
            return sum;
        }
    }



}
