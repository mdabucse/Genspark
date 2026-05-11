using NotificationAppModelLibrary;
using NotificationAppDALLibrary;

namespace NotificationAppBLLibrary
{
    public class NotificationService
    {
        private readonly NotificationRepository _notificationRepository;

        public NotificationService()
        {
            _notificationRepository = new NotificationRepository();
        }

        public void SendNotification(
            INotification notificationSender,
            UserDetails userDetails,
            Notification notification)
        {
            // Message Validation
            if (string.IsNullOrWhiteSpace(notification.Message))
            {
                throw new Exception("Message cannot be empty");
            }

            // Minimum Length Validation
            if (notification.Message.Length < 5)
            {
                throw new Exception("Message should contain at least 5 characters");
            }

            // Email Validation
            if (notification.NotificationType == "Email")
            {
                if (string.IsNullOrWhiteSpace(userDetails.Email))
                {
                    throw new Exception("Valid email is required");
                }
            }

            // SMS Validation
            if (notification.NotificationType == "SMS")
            {
                if (string.IsNullOrWhiteSpace(userDetails.PhoneNumber))
                {
                    throw new Exception("Valid phone number is required");
                }

                if (notification.Message.Length > 160)
                {
                    throw new Exception("SMS cannot exceed 160 characters");
                }
            }

            // Add Sent Date
            notification.SentDate = DateTime.Now;

            // Send Notification
            notificationSender.Send(userDetails, notification.Message);

            // Save Notification
            _notificationRepository.Save(notification);

            Console.WriteLine("Notification sent successfully");
        }

        public List<Notification> GetAllNotifications()
        {
            return _notificationRepository.GetAll();
        }
    }
}