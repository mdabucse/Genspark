using System.Collections.Generic;

namespace Game.Models
{
    internal class GameState
    {
        public  string? HiddenWord { get; set; }

        public int CurrentAttempt { get; set; }

        public int MaxAttempts { get; set; }

        public bool IsGameWon { get; set; }

        public int Score { get; set; }

        public DifficultyLevel Difficulty { get; set; }

        public HashSet<string> visitedWords;

        public GameState()
        {
            CurrentAttempt = 1;
            MaxAttempts = 6;
            IsGameWon = false;
            Score = 0;
            visitedWords = new HashSet<string>();
        }
    }
}