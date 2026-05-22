using System;
namespace Interfaces;
using Models;
public interface ITokenService
{
    public string CreateNewToken(TokenRequest request);
} 