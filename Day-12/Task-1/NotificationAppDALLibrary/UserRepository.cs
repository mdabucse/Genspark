using System;
using NotificationAppModelLibrary;
using Npgsql;

namespace NotificationAppDALLibrary
{
    public class UserRepository : IRepository<string, UserDetails>
    {
        private readonly string connectionString = "Host=localhost;Port=5432;Database=notificationdb;Username=mohamedabubakkars;Password=root";

        public UserRepository()
        {
            EnsureUserTableExists();
        }

        private void EnsureUserTableExists()
        {
            string createTableQuery = @"
                CREATE TABLE IF NOT EXISTS users(
                    username VARCHAR(100) PRIMARY KEY,
                    email VARCHAR(255),
                    phonenumber VARCHAR(50)
                );
            ";

            using var connection = new NpgsqlConnection(connectionString);
            using var command = new NpgsqlCommand(createTableQuery, connection);

            connection.Open();
            command.ExecuteNonQuery();
        }

        public UserDetails Create(UserDetails value)
        {
            string query = @"
                INSERT INTO users(username, email, phonenumber)
                VALUES(@username, @email, @phonenumber)
                ON CONFLICT(username) DO UPDATE
                SET email = EXCLUDED.email,
                    phonenumber = EXCLUDED.phonenumber;
            ";

            using var connection = new NpgsqlConnection(connectionString);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", value.UserName ?? string.Empty);
            command.Parameters.AddWithValue("@email", value.Email ?? string.Empty);
            command.Parameters.AddWithValue("@phonenumber", value.PhoneNumber ?? string.Empty);

            connection.Open();
            command.ExecuteNonQuery();

            return value;
        }

        public UserDetails? Read(string name)
        {
            string query = @"
                SELECT username, email, phonenumber
                FROM users
                WHERE username = @username
            ";

            using var connection = new NpgsqlConnection(connectionString);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", name);

            connection.Open();
            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                return new UserDetails
                {
                    UserName = reader["username"].ToString(),
                    Email = reader["email"].ToString(),
                    PhoneNumber = reader["phonenumber"].ToString()
                };
            }

            return null;
        }

        public UserDetails? Update(string name, UserDetails value)
        {
            string query = @"
                UPDATE users
                SET email = @email,
                    phonenumber = @phonenumber
                WHERE username = @username
            ";

            using var connection = new NpgsqlConnection(connectionString);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", name);
            command.Parameters.AddWithValue("@email", value.Email ?? string.Empty);
            command.Parameters.AddWithValue("@phonenumber", value.PhoneNumber ?? string.Empty);

            connection.Open();
            int rows = command.ExecuteNonQuery();
            if (rows > 0)
            {
                return value;
            }

            return null;
        }

        public UserDetails? Delete(string name)
        {
            var existingUser = Read(name);
            if (existingUser == null)
            {
                return null;
            }

            string query = @"
                DELETE FROM users
                WHERE username = @username
            ";

            using var connection = new NpgsqlConnection(connectionString);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", name);

            connection.Open();
            int rows = command.ExecuteNonQuery();
            if (rows > 0)
            {
                return existingUser;
            }

            return null;
        }
    }
}
