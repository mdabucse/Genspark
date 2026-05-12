using System;
using Npgsql;

namespace GameWithDb.DAL
{
    public class DbConnectionFactory
    {
        private readonly string connectionString =
            "Host=localhost;Port=5432;Database=gamewithdb;Username=mohamedabubakkars;Password=root";

        public NpgsqlConnection GetConnection()
        {
            NpgsqlConnection connection =
                new NpgsqlConnection(connectionString);

            connection.Open();

            return connection;
        }
    }
}