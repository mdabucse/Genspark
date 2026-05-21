using Microsoft.AspNetCore.Mvc;
using Interfaces;
using Models;
using DTOs;
using Helpers;

namespace DTOWithAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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

            RegisterResponseDto response =
                new RegisterResponseDto
                {
                    Id = createdUser.Id,
                    Name = createdUser.Name,
                    Email = createdUser.Email,
                    Message = "User Registered Successfully"
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
                return Ok("Login Successful");
            }
            return BadRequest("Incorrect password");
        } 

    }
}