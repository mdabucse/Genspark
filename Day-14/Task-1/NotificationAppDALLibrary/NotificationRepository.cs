using Microsoft.EntityFrameworkCore;
using NotificationAppModelLibrary;
using NotificationAppDALLibrary.Contexts;

namespace NotificationAppDALLibrary
{
    public class NotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository()
        {
            _context = new AppDbContext();
        }

        // Save Notification
        public void Save(Notification notification)
        {
            _context.Notifications.Add(notification);

            _context.SaveChanges();

            Console.WriteLine(
                "Notification inserted successfully"
            );
        }

        // Get All Notifications
        public List<Notification> GetAll()
        {
            return _context.Notifications
                           .Include(n => n.Account)
                           .ToList();
        }
    }
}