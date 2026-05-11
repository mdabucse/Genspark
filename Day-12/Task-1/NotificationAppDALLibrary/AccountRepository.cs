using System;
using System.Data;
using System.Collections.Generic;
using NotificationAppModelLibrary;
using Npgsql;
using System.Runtime.CompilerServices;

namespace NotificationAppDALLibrary 
{
    public class AccountRepository : IRepository<string, Account>
    {
        private readonly string connectionstring = "Host=localhost;Port=5432;Database=notificationdb;Username=mohamedabubakkars;Password=root";
        // Get the Last Account Number
        public string getLastAccountNumber()
        {
            string lastAccountNumber = "9990001000";
            string query = @"
            select accountnumber from accounts
            order by createdTime desc
            limit 1
            ";

            using var connection = new NpgsqlConnection(connectionstring);
            using var command = new NpgsqlCommand(query, connection);
            try
            {
                connection.Open();
                object? result = command.ExecuteScalar();
                if (result != null)
                {
                    lastAccountNumber = result.ToString() ?? lastAccountNumber;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Can't Fetch The Last Number");
                Console.WriteLine(e.Message);
            }
            return lastAccountNumber;
        }
        
        // Create the Account
        public Account Create(Account value)
        {
            string query = @"
            INSERT INTO accounts(
                accountnumber,
                username,
                balance,
                createdTime
            )
            values(
                @accountnumber,
                @username,
                @balance,
                @createdTime
            )
            ";

            string lastAccountNumber = getLastAccountNumber();
            lastAccountNumber = (long.Parse(lastAccountNumber) + 1).ToString();
            value.AccountNumber = lastAccountNumber;

            using var connection = new NpgsqlConnection(connectionstring);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@accountnumber", value.AccountNumber);
            command.Parameters.AddWithValue("@username", value.UserName ?? string.Empty);
            command.Parameters.AddWithValue("@balance", value.Balance);
            command.Parameters.AddWithValue("@createdTime", value.CreatedDate);

            try
            {
                connection.Open();
                int result = command.ExecuteNonQuery();
                Console.WriteLine("Result : " + result);
                if (result > 0)
                {
                    Console.WriteLine("User Inserted in DB Successfully");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine("User Not Inserted ");
            }

            return value;
        }

        public Account? Read(string key)
        {
            string query = @"
            SELECT accountnumber, username, balance, createdTime
            FROM accounts
            WHERE accountnumber = @accountnumber
            ";

            using var connection = new NpgsqlConnection(connectionstring);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@accountnumber", key);

            try
            {
                connection.Open();
                using var reader = command.ExecuteReader();
                if (reader.Read())
                {
                    return new Account
                    {
                        AccountNumber = reader["accountnumber"].ToString(),
                        UserName = reader["username"].ToString(),
                        Balance = Convert.ToSingle(reader["balance"]),
                        CreatedDate = reader.GetDateTime(reader.GetOrdinal("createdtime"))
                    };
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error Reading Account");
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("Account not found");
            return null;
        }

        public Account? Update(string key, Account value)
        {
            string query = @"
            UPDATE accounts
            SET username = @username,
                balance = @balance,
                createdTime = @createdtime
            WHERE accountnumber = @accountnumber
            ";

            using var connection = new NpgsqlConnection(connectionstring);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@accountnumber", key);
            command.Parameters.AddWithValue("@username", value.UserName ?? string.Empty);
            command.Parameters.AddWithValue("@balance", value.Balance);
            command.Parameters.AddWithValue("@createdTime", value.CreatedDate);

            try
            {
                connection.Open();
                int rows = command.ExecuteNonQuery();
                if (rows > 0)
                {
                    value.AccountNumber = key;
                    return value;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error Updating Account");
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("Account not found");
            return null;
        }

        public Account? Delete(string key)
        {
            Account? existingAccount = Read(key);
            if (existingAccount == null)
            {
                Console.WriteLine("Account not found");
                return null;
            }

            string query = @"
            DELETE FROM accounts
            WHERE accountnumber = @accountnumber
            ";

            using var connection = new NpgsqlConnection(connectionstring);
            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@accountnumber", key);

            try
            {
                connection.Open();
                int rows = command.ExecuteNonQuery();
                if (rows > 0)
                {
                    return existingAccount;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error Deleting Account");
                Console.WriteLine(e.Message);
            }

            return null;
        }
    }
}