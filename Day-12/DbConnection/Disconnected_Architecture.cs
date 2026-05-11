using Npgsql;
using System.Data;

namespace DisconnectedArchitectureDemo
{
    internal class Program
    {
        // Connection String
        string connectionString =
            "Host=localhost;Port=5432;Database=genspark;Username=mohamedabubakkars;Password=root";

        // Connection Object
        NpgsqlConnection connection;

        public Program()
        {
            connection = new NpgsqlConnection(connectionString);
        }

        // DISCONNECTED ARCHITECTURE METHOD
        public void GetProductDataUsingDataTable()
        {
            // SQL Query
            string query = "SELECT * FROM Products";

            // DataTable stores data in memory
            DataTable table = new DataTable();

            try
            {
                // Open connection
                connection.Open();

                // Command object
                NpgsqlCommand command = new NpgsqlCommand(query, connection);

                // DataAdapter object
                NpgsqlDataAdapter adapter = new NpgsqlDataAdapter(command);

                // Fill DataTable with database data
                adapter.Fill(table);

                // Connection can be closed now
                connection.Close();

                Console.WriteLine("Connection Closed");
                Console.WriteLine();

                // Reading data from DataTable
                // No database connection required here
                foreach (DataRow row in table.Rows)
                {
                    Console.WriteLine("Product Id : " + row["productid"]);
                    Console.WriteLine("Product Name : " + row["productname"]);
                    Console.WriteLine("----------------------------");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
            }
        }

    }
}