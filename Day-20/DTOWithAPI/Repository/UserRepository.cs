using System;
using Models;
using Microsoft.EntityFrameworkCore;
using Interfaces;
using Context;

namespace Repository;

public class UserRepository : IUserRepository
{
    private readonly UserContext _context;
    public UserRepository(UserContext context)
    {
        _context = context;
    }
    public User CreateUser(User user)
    {
        _context.User.Add(user);
        _context.SaveChanges();
        return user;
    }

    public User? GetUserByEmail(string email)
    {
        return _context.User
                .FirstOrDefault(x=> x.Email==email);
    }

    public bool UserExists(string email)
    {
        return _context.User
                .Any(x => x.Email == email);
    }
}