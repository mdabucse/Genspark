using Models;

namespace Interfaces
{
    public interface IUserRepository
    {
        User? GetUserByEmail(string email);

        User CreateUser(User user);

        bool UserExists(string email);

        List<User> GetAllUsers();
    }
}