using System;

namespace GameWithDb.Models
{
    public class Score
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ScoreValue { get; set; }

        public string Difficulty { get; set; }

        public DateTime PlayedAt { get; set; }
    }
}