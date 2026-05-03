using System;

class Program
{
    static void Main(string[] args)
    {

        // Two Sum
        TwoSumClass twoSum = new TwoSumClass();
        int[] result = twoSum.TwoSum(new int[] { 2, 7, 11, 15 }, 9);
        Console.WriteLine($"TwoSum Result: [{result[0]}, {result[1]}]");

        // Remove Element
        RemoveElementClass remove = new RemoveElementClass();
        int[] nums = { 3, 2, 2, 3 };
        int k = remove.RemoveElement(nums, 3);
        Console.WriteLine($"RemoveElement Result Length: {k}");

        // Longest Palindrome
        LongestPalindromeClass lp = new LongestPalindromeClass();
        string res = lp.LongestPalindrome("babad");
        Console.WriteLine($"Longest Palindrome: {res}");

        // Jump Game II
        JumpGameClass jump = new JumpGameClass();
        int jumps = jump.JumpGame(new int[] { 2, 3, 1, 1, 4 });
        Console.WriteLine($"Jump Game II: {jumps}");
    }
}