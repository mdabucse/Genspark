using System;
using Npgsql;
namespace GameWithDb.DAL
{
    public class WordProvider
    {
        public static string GetRandomWord()
        {
            DbConnectionFactory baseconnection = new DbConnectionFactory();
            string query = @"
            select word from words
            order by Random()
            Limit 1
            ";
            try
            {
                // System.Console.WriteLine("Fetching a random word from the database...");
                
                using var command = new NpgsqlCommand(query, baseconnection.GetConnection());

                using var reader = command.ExecuteReader();  // The using keyword it automatically closes the object (connection close)

                if (reader.Read())
                {
                    // System.Console.WriteLine("Word Fetched");
                    return reader.GetString(
                        reader.GetOrdinal("word")
                    );
                }

                throw new Exception(
                    "No words found in database."
                );
            }
            catch
            {
                System.Console.WriteLine("The Db not Fetching the Random Values");
                throw;
            }

        }
    }
}