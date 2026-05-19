using System;
using Microsoft.AspNetCore.Mvc;
namespace WebAPIBasics.Controller;


[Route("api/[controller]")]
[ApiController]
public class Account : ControllerBase
{
    [HttpGet]
    public string Greet()
    {
        return "Hello World";
    }

    [HttpGet("WithName")]
    public string GreetWithName(string Name) // Query params
    {
        return $"Hello {Name}";
    }

    [HttpPost]
    public String GreetPost([FromBody] String Name) // When we use the strings directly we dont use the json format in the Body duting the calls we just pass the value in the "";
    {
        return $"Success {Name}";
    }

}