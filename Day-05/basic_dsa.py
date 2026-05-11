# Two Sum
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        map ={}
        for i,val in enumerate(nums):
            rem = target-val
            if rem in map:
                return [i,map[rem]]
            map[val]=i


 
# Longest Palindromic Substring
class Solution:
    def longestPalindrome(self, s: str) -> str:

        res = ''
        resLen = 0
        for i in range(len(s)):
            l,r = i,i
            while l>=0 and r<len(s) and s[l]==s[r]:
                if resLen< (r-l+1):
                    res = s[l:r+1]
                    resLen = r-l+1
                r+=1
                l-=1
            l,r = i,i+1
            while l>=0 and r<len(s) and s[l]==s[r]:
                if resLen< (r-l+1):
                    res = s[l:r+1]
                    resLen = r-l+1
                r+=1
                l-=1
        return res


# Remove Element
from typing import List
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        for i in range(len(nums)):
            if val in nums:
                nums.remove(val)
        return len(nums)
            

# Jump Game II
class Solution:
    def jump(self, nums: list[int]) -> int:
        jumps = 0
        current_end = 0
        farthest = 0
        
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            
            if i == current_end:
                jumps += 1
                current_end = farthest
        
        return jumps