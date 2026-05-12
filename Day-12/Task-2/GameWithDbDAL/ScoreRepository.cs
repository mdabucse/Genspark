using System;
using System.Collections.Generic;
using Npgsql;
using GameWithDb.Models;

namespace GameWithDb.DAL
{
    public class ScoreRepository
    {
        DbConnectionFactory factory =
            new DbConnectionFactory();

        public bool SaveScore(Score score)
        {
            string query = @"
                INSERT INTO scores
                (user_id, score, difficulty)
                VALUES
                (@userid, @score, @difficulty);
            ";

            try
            {
                using var connection =
                    factory.GetConnection();

                using var command =
                    new NpgsqlCommand(query, connection);

                command.Parameters.AddWithValue(
                    "@userid",
                    score.UserId
                );

                command.Parameters.AddWithValue(
                    "@score",
                    score.ScoreValue
                );

                command.Parameters.AddWithValue(
                    "@difficulty",
                    score.Difficulty
                );

                int rows =
                    command.ExecuteNonQuery();

                return rows > 0;
            }
            catch
            {
                throw;
            }
        }
                public List<Score> GetScoresByUser(
            int userId
        )
        {
            List<Score> scores =
                new List<Score>();

            string query = @"
                SELECT *
                FROM scores
                WHERE user_id = @userid
                ORDER BY played_at DESC;
            ";

            using var connection =
                factory.GetConnection();

            using var command =
                new NpgsqlCommand(query, connection);

            command.Parameters.AddWithValue(
                "@userid",
                userId
            );

            using var reader =
                command.ExecuteReader();

            while (reader.Read())
            {
                Score score = new Score
                {
                    Id = Convert.ToInt32(
                        reader["id"]
                    ),

                    UserId = Convert.ToInt32(
                        reader["user_id"]
                    ),

                    ScoreValue = Convert.ToInt32(
                        reader["score"]
                    ),

                    Difficulty = reader["difficulty"]
                        .ToString(),

                    PlayedAt = Convert.ToDateTime(
                        reader["played_at"]
                    )
                };

                scores.Add(score);
            }

            return scores;
        }
    }
}