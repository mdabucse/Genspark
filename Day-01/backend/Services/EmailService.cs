using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace BusBooking.API.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendBookingConfirmationAsync(Booking booking)
    {
        await SendBookingConfirmationToAsync(booking, booking.User.Email, booking.User.Name);
    }

    public async Task SendBookingConfirmationToAsync(Booking booking, string recipientEmail, string recipientName)
    {
        var subject = $"Booking Confirmed — {booking.BookingRef}";
        var htmlBody = $@"
            <h2 style='color: #2563eb;'>🎉 Booking Confirmed!</h2>
            <p>Dear {recipientName},</p>
            <p>Your bus booking has been confirmed successfully.</p>
            <table style='border-collapse: collapse; width: 100%; max-width: 500px;'>
                <tr><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>Booking Ref</td><td style='padding: 8px; border: 1px solid #ddd;'>{booking.BookingRef}</td></tr>
                <tr><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>Bus</td><td style='padding: 8px; border: 1px solid #ddd;'>{booking.Trip.Bus.BusName} ({booking.Trip.Bus.BusType})</td></tr>
                <tr><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>Route</td><td style='padding: 8px; border: 1px solid #ddd;'>{booking.Trip.Route.Source} → {booking.Trip.Route.Destination}</td></tr>
                <tr><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>Departure</td><td style='padding: 8px; border: 1px solid #ddd;'>{booking.Trip.DepartureTime:dd MMM yyyy, hh:mm tt}</td></tr>
                <tr><td style='padding: 8px; border: 1px solid #ddd; font-weight: bold;'>Total Amount</td><td style='padding: 8px; border: 1px solid #ddd;'>₹{booking.TotalAmount:N2}</td></tr>
            </table>
            <p style='margin-top: 20px;'>Please carry a valid Photo ID for verification.</p>
            <p>Thank you for booking with us! 🚌</p>";

        await SendEmailAsync(recipientEmail, recipientName, subject, htmlBody);
    }

    public async Task SendCancellationEmailAsync(Booking booking)
    {
        await SendCancellationEmailToAsync(booking, booking.User.Email, booking.User.Name);
    }

    public async Task SendCancellationEmailToAsync(Booking booking, string recipientEmail, string recipientName)
    {
        var subject = $"Booking Cancelled — {booking.BookingRef}";
        var htmlBody = $@"
            <h2 style='color: #dc2626;'>Booking Cancelled</h2>
            <p>Dear {recipientName},</p>
            <p>Your booking <strong>{booking.BookingRef}</strong> has been cancelled.</p>
            <div style='background: #fef2f2; border: 1px solid #fee2e2; padding: 15px; border-radius: 8px;'>
                <p style='margin: 0;'><strong>Refund Summary:</strong></p>
                <p style='margin: 5px 0;'>Original Amount: ₹{booking.TotalAmount:N2}</p>
                <p style='margin: 5px 0; color: #dc2626;'>Deduction Fee: - ₹{booking.DeductionAmount:N2}</p>
                <p style='margin: 10px 0 0 0; font-size: 1.1em; font-weight: bold;'>Total Refund: ₹{booking.RefundAmount:N2}</p>
            </div>
            <p>Your refund will be processed within 5-7 business days to your original payment method.</p>
            <p style='margin-top: 20px;'>If you did not initiate this cancellation, please contact our support immediately.</p>
            <p>We hope to serve you again soon! 🚌</p>";

        await SendEmailAsync(recipientEmail, recipientName, subject, htmlBody);
    }

    public async Task SendBusBlockedNotificationAsync(Booking booking)
    {
        var subject = $"Trip Update: Important Information regarding your booking {booking.BookingRef}";
        var htmlBody = $@"
            <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>
                <div style='background: #f59e0b; padding: 20px; color: white;'>
                    <h2 style='margin: 0;'>Important Trip Update</h2>
                </div>
                <div style='padding: 24px;'>
                    <p>Dear {booking.User.Name},</p>
                    <p>We are writing to inform you that the bus scheduled for your trip (<strong>{booking.BookingRef}</strong>) is temporarily unavailable due to maintenance or operational reasons.</p>
                    
                    <div style='background: #fffbeb; border: 1px solid #fef3c7; padding: 16px; border-radius: 8px; margin: 20px 0;'>
                        <p style='margin: 0; font-weight: bold;'>Trip Details:</p>
                        <p style='margin: 5px 0;'>{booking.Trip.Route.Source} → {booking.Trip.Route.Destination}</p>
                        <p style='margin: 5px 0;'>Departure: {booking.Trip.DepartureTime:dd MMM yyyy, hh:mm tt}</p>
                    </div>

                    <p><strong>What happens next?</strong></p>
                    <p>Our team is working on arranging an alternative bus or rescheduling the trip. You will receive another update shortly.</p>
                    <p>If you wish to cancel this booking and get a full refund, you can do so through the mobile app or website, or reply to this email for assistance.</p>
                    
                    <p style='color: #64748b; font-size: 0.9em; margin-top: 24px;'>We apologize for the inconvenience caused.</p>
                    <p>Regards,<br>Bus Booking Support Team</p>
                </div>
            </div>";

        await SendEmailAsync(booking.User.Email, booking.User.Name, subject, htmlBody);
    }

    public async Task SendOperatorApprovalEmailAsync(User user)
    {
        var subject = "Welcome! Your Operator Account is Approved";
        var htmlBody = $@"
            <h2 style='color: #16a34a;'>🎉 Account Approved!</h2>
            <p>Dear {user.Name},</p>
            <p>Your bus operator account has been approved. You can now:</p>
            <ul>
                <li>Add and manage your buses</li>
                <li>Schedule trips</li>
                <li>View bookings on your buses</li>
            </ul>
            <p>Log in to get started!</p>";

        await SendEmailAsync(user.Email, user.Name, subject, htmlBody);
    }

    private async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        try
        {
            var username = _config["SmtpSettings:Username"];
            var password = _config["SmtpSettings:Password"];
            var host = _config["SmtpSettings:Host"];
            var port = int.Parse(_config["SmtpSettings:Port"] ?? "587");

            if (string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(host))
            {
                _logger.LogWarning("SMTP settings are incomplete; skipped email to {Email}", toEmail);
                return;
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Bus Booking System", username));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = htmlBody };
            message.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(username, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Email sent to {Email}: {Subject}", toEmail, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            // Don't throw — email failure shouldn't block the business flow
        }
    }
}
