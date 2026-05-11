using BusBooking.API.Data;
using BusBooking.API.DTOs.Auth;
using BusBooking.API.Helpers;
using BusBooking.API.Interfaces;
using BusBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BusBooking.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly JwtHelper _jwt;

    public AuthService(AppDbContext db, JwtHelper jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Check for duplicate email
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            throw new ArgumentException("Email already registered");

        // Validate role
        var validRoles = new[] { "customer", "operator" };
        if (!validRoles.Contains(dto.Role.ToLower()))
            throw new ArgumentException("Invalid role. Must be 'customer' or 'operator'");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Role = dto.Role.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsActive = dto.Role.ToLower() == "customer", // Operators need admin approval
            IsVerified = false
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = _jwt.GenerateToken(user),
            Role = user.Role,
            Name = user.Name,
            Email = user.Email,
            UserId = user.Id
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account is not active. Please contact support.");

        return new AuthResponseDto
        {
            Token = _jwt.GenerateToken(user),
            Role = user.Role,
            Name = user.Name,
            Email = user.Email,
            UserId = user.Id
        };
    }

    public async Task<UserProfileDto> GetProfileAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("User not found");

        return new UserProfileDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role
        };
    }

    public async Task<UserProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) throw new KeyNotFoundException("User not found");

        user.Name = dto.Name;
        user.Phone = dto.Phone;

        await _db.SaveChangesAsync();

        return new UserProfileDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role
        };
    }
}
