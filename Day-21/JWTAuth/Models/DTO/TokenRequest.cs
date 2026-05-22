using System;
using System.Diagnostics.Contracts;
namespace Models;

public class TokenRequest
{
    public string Username {get;set;} = string.Empty;
    public string Role {get;set;} = string.Empty;
}