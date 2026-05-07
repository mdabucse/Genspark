public class Solution {
    public int MinimumTotal(IList<IList<int>> triangle) {
        int [] dp = new int[triangle.Count];
        
        // Copy the last row to DP
        for(int i=0;i<triangle[triangle.Count-1].Count;i++){
            dp[i] = triangle[triangle.Count-1][i];
        }

        // Process Bottom to Top
        for (int row = triangle.Count - 2; row >= 0; row--)
        {
            for (int col = 0; col < triangle[row].Count; col++)
            {
                dp[col] = triangle[row][col] + Math.Min(dp[col], dp[col + 1]);
            }
        }

        return dp[0];

    }
}