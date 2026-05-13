using Microsoft.EntityFrameworkCore;
using NotificationAppModelLibrary;
using NotificationAppDALLibrary.Contexts;

namespace NotificationAppDALLibrary
{
    public class UserRepository : IRepository<int, UserDetails>
    {
        private readonly AppDbContext _context;

        public UserRepository()
        {
            _context = new AppDbContext();
        }

        // Create User
        public UserDetails Create(UserDetails value)
        {
            _context.Users.Add(value);

            _context.SaveChanges();

            return value;
        }

        // Read User
        public UserDetails? Read(int key)
        {
            return _context.Users
                           .Include(u => u.Accounts)
                           .FirstOrDefault(u => u.Id == key);
        }

        // Update User
        public UserDetails? Update(int key, UserDetails value)
        {
            var existingUser =
                _context.Users.FirstOrDefault(
                    u => u.Id == key
                );

            if (existingUser == null)
            {
                return null;
            }

            existingUser.UserName = value.UserName;
            existingUser.Email = value.Email;
            existingUser.PhoneNumber = value.PhoneNumber;

            _context.SaveChanges();

            return existingUser;
        }

        // Delete User
        public UserDetails? Delete(int key)
        {
            var existingUser =
                _context.Users.FirstOrDefault(
                    u => u.Id == key
                );

            if (existingUser == null)
            {
                return null;
            }

            _context.Users.Remove(existingUser);

            _context.SaveChanges();

            return existingUser;
        }
    }
}