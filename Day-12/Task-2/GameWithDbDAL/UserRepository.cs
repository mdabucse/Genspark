using System;
using Npgsql;
using GameWithDb.Models;

namespace GameWithDb.DAL
{
    public class UserRepository
    {
        DbConnectionFactory factory =
            new DbConnectionFactory();

        // Register User
        public bool RegisterUser(User user)
        {
            string query = @"
                INSERT INTO users(username, password)
                VALUES(@username, @password);
            ";

            try
            {
                using var connection =
                    factory.GetConnection();

                using var command =
                    new NpgsqlCommand(query, connection);

                command.Parameters.AddWithValue(
                    "@username",
                    user.Username
                );

                command.Parameters.AddWithValue(
                    "@password",
                    user.Password
                );

                int rowsAffected =
                    command.ExecuteNonQuery();

                return rowsAffected > 0;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);

                return false;
            }
        }

        // Login User
        public User? LoginUser(
    string username,
    string password
)
        {
            string query = @"
        SELECT *
        FROM users
        WHERE username = @username
        AND password = @password;
    ";

            try
            {
                using var connection =
                    factory.GetConnection();

                using var command =
                    new NpgsqlCommand(query, connection);

                command.Parameters.AddWithValue(
                    "@username",
                    username
                );

                command.Parameters.AddWithValue(
                    "@password",
                    password
                );

                using var reader =
                    command.ExecuteReader();

                if (reader.Read())
                {
                    return new User
                    {
                        Id = Convert.ToInt32(
                            reader["id"]
                        ),

                        Username = reader["username"]
                            .ToString(),

                        Password = reader["password"]
                            .ToString()
                    };
                }

                return null;
            }
            catch
            {
                throw;
            }
        }
    }
}