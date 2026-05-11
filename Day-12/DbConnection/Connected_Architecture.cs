using Npgsql;

namespace UnderstandingADOApp
{
    internal class Program
    {
        string connectionString =
            "Host=localhost;Port=5432;Database=genspark;Username=mohamedabubakkars;Password=root";

        NpgsqlConnection connection;

        public Program()
        {
            connection = new NpgsqlConnection(connectionString);
        }

        public class User
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // Get user details
        private User GetUserDetails()
        {
            User user = new User();

            Console.WriteLine("Enter the user name");
            user.Username = Console.ReadLine() ?? "";

            Console.WriteLine("Enter the password");
            user.Password = Console.ReadLine() ?? "";

            return user;
        }

        // Insert user
        void InsertValuesToDb()
        {
            User user = GetUserDetails();

            string insertCmd =
                "INSERT INTO forcsharp(username, password) VALUES(@username, @password)";

            NpgsqlCommand command = new NpgsqlCommand(insertCmd, connection);

            command.Parameters.AddWithValue("@username", user.Username);
            command.Parameters.AddWithValue("@password", user.Password);

            try
            {
                connection.Open();

                int result = command.ExecuteNonQuery();

                Console.WriteLine("Result : " + result);

                if (result > 0)
                {
                    Console.WriteLine("User Inserted Successfully");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        // Update user password
        void UpdateUserToDatabase(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) ||
                string.IsNullOrWhiteSpace(user.Password))
            {
                throw new Exception("Username or Password cannot be empty");
            }

            string updateCmd =
                "UPDATE forcsharp SET password = @password WHERE username = @username";

            NpgsqlCommand command = new NpgsqlCommand(updateCmd, connection);

            command.Parameters.AddWithValue("@username", user.Username);
            command.Parameters.AddWithValue("@password", user.Password);

            try
            {
                connection.Open();

                int result = command.ExecuteNonQuery();

                if (result > 0)
                {
                    Console.WriteLine("User details updated");
                }
                else
                {
                    Console.WriteLine("No user found");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        public void InitiateUserDataUpdate()
        {
            User user = new User();

            Console.WriteLine("Enter username to update");
            user.Username = Console.ReadLine() ?? "";

            Console.WriteLine("Enter new password");
            user.Password = Console.ReadLine() ?? "";

            try
            {
                UpdateUserToDatabase(user);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        // Read product data
        void GetProductDataFromDatabase()
        {
            string selectQuery = "SELECT * FROM Products LIMIT 1";

            NpgsqlCommand command = new NpgsqlCommand(selectQuery, connection);

            try
            {
                connection.Open();

                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    Console.WriteLine("Product Id : " + reader[0]);
                    Console.WriteLine("Product Name : " + reader[1]);
                }

                Console.WriteLine("Done reading");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                connection.Close();
            }
        }

        
    }
}