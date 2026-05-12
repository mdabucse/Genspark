using System;
using GameWithDb.DAL;
using GameWithDb.Models;

namespace GameWithDb.BLL
{
    public class AuthenticationService
    {
        UserRepository repository =
            new UserRepository();

        // Register
        public bool Register(
            string username,
            string password
        )
        {
            if (
                string.IsNullOrWhiteSpace(username)
                ||
                string.IsNullOrWhiteSpace(password)
            )
            {
                throw new Exception(
                    "Username and Password cannot be empty."
                );
            }

            User user = new User
            {
                Username = username,
                Password = password
            };

            return repository.RegisterUser(user);
        }

        // Login
        public User? Login(string username,string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                throw new Exception(
                    "Username and Password cannot be empty."
                );
            }

            return repository.LoginUser(
                username,
                password
            );
        }
    }
}