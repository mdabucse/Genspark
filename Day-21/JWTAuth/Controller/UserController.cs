using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Interfaces;
using Models;
using DTOs;
using Helpers;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public UserController(IUserRepository userRepository, JwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequestDto request)
        {
            bool userExists = _userRepository
                .UserExists(request.Email);

            if (userExists)
            {
                return BadRequest("User already exists");
            }

            User user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Password = PasswordHasher.HashPassword(request.Password)
            };

            User createdUser = _userRepository
                .CreateUser(user);

            // Generate JWT token
            string token = _jwtTokenGenerator.GenerateToken(createdUser);

            RegisterResponseDto response =
                new RegisterResponseDto
                {
                    Id = createdUser.Id,
                    Name = createdUser.Name,
                    Email = createdUser.Email,
                    Token = token
                };

            return Ok(response);
        }
        
        [HttpPost("login")]
        public IActionResult Login(LoginRequestDto request)
        {
            User? user = _userRepository.GetUserByEmail(request.Email);
            if (user == null)
            {
                return BadRequest("No user Found");
            }
            if(user.Password.SequenceEqual(PasswordHasher.HashPassword(request.Password)))
            {
                // Generate JWT token
                string token = _jwtTokenGenerator.GenerateToken(user);

                LoginResponseDto response = new LoginResponseDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Token = token
                };

                return Ok(response);
            }
            return BadRequest("Incorrect password");
        }

        [Authorize]
        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            List<User> users = _userRepository.GetAllUsers();
            
            // Map User to a DTO without passwords
            var userDtos = users.Select(u => new
            {
                id = u.Id,
                name = u.Name,
                email = u.Email
            }).ToList();

            return Ok(userDtos);
        }

    }
}