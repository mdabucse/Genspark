using System;
using System.Drawing;
namespace Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public byte[] Password {get;set;} = [];
    }
}