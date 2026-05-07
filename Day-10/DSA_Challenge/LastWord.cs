public class Solution {
    public int LengthOfLastWord(string s) {
        string[] words = s.Trim().Split(" ");
        string lastword =  words[words.Length-1];
        return lastword.Length;
    }
}