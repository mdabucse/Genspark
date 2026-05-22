using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Models;

namespace Helpers
{
    public class JwtTokenGenerator
    {
        private readonly IConfiguration _configuration;

        public JwtTokenGenerator(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            // Get JWT configuration
            var key = _configuration["JWT:Key"];
            var issuer = _configuration["JWT:Issuer"];
            var durationInMinutes = int.Parse(_configuration["JWT:DurationInMinutes"] ?? "60");

            // Create security key
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));

            // Create signing credentials
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Create claims
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Create token
            var token = new JwtSecurityToken(
                issuer: issuer,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(durationInMinutes),
                signingCredentials: credentials
            );

            // Return token string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
