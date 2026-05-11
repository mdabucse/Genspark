using System;
using NotificationAppModelLibrary;
using Npgsql;
using System.Data;
namespace NotificationAppDALLibrary
{
    public class NotificationRepository
    {
        // DB Connections
        string connectionString = "Host=localhost;Port=5432;Database=notificationdb;Username=mohamedabubakkars;Password=root";
        NpgsqlConnection connection;
        public NotificationRepository()
        {
            connection = new NpgsqlConnection(connectionString);
        }

        public void Save(Notification notification)
        {
            string insertCmd =
                @"INSERT INTO notifications(
                accountnumber,
                username,
                message,
                notificationtype,
                sentdate)
                values (@accountnumber,@username,@message,@notificationtype,@sentdate);";

            NpgsqlCommand command = new NpgsqlCommand(insertCmd, connection);
            command.Parameters.AddWithValue("@accountnumber", notification.AccountNumber ?? "");
            command.Parameters.AddWithValue("@username", notification.UserName ?? "");
            command.Parameters.AddWithValue("@message", notification.Message ?? "");
            command.Parameters.AddWithValue("@notificationtype", notification.NotificationType ?? "");
            command.Parameters.AddWithValue("@sentdate", notification.SentDate);

            try
            {
                connection.Open();

                int result = command.ExecuteNonQuery();

                Console.WriteLine("Result : " + result);

                if (result > 0)
                {
                    Console.WriteLine("Inserted Notification in DB Successfully");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine("Not Inserted");
            }
            finally
            {
                connection.Close();
            }

        }

        public List<Notification> GetAll()
        {
            List<Notification> notifications =
                new List<Notification>();

            try
            {
                string query =
                @"SELECT
                accountnumber,
                username,
                message,
                notificationtype,
                sentdate
                FROM notifications";

                // Command object
                NpgsqlCommand command =
                    new NpgsqlCommand(query, connection);

                // DataAdapter object
                NpgsqlDataAdapter adapter =
                    new NpgsqlDataAdapter(command);

                // DataTable object
                DataTable table = new DataTable();

                // Fill DataTable
                adapter.Fill(table);

                // Convert DataTable rows to Notification objects
                foreach (DataRow row in table.Rows)
                {
                    Notification notification =
                        new Notification
                        {
                            AccountNumber =
                                row["accountnumber"].ToString(),

                            UserName =
                                row["username"].ToString(),

                            Message =
                                row["message"].ToString(),

                            NotificationType =
                                row["notificationtype"].ToString(),

                            SentDate =
                                Convert.ToDateTime(
                                    row["sentdate"]
                                )
                        };

                    notifications.Add(notification);
                }

                // Close connection
                connection.Close();
            }
            catch (Exception e)
            {
                Console.WriteLine(
                    "Error Fetching Notifications"
                );

                Console.WriteLine(e.Message);
            }

            return notifications;
        }
    }
}