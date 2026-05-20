using System;
using IInterfaces;
using Microsoft.AspNetCore.Mvc;
using Model;
using Repository;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly IGenericRepository<Book> _bookRepository;
    public BookController(IGenericRepository<Book> bookRepository)
    {
        _bookRepository = bookRepository;
    }
    [HttpPost]
    public IActionResult CreateMember(Book book)
    {
        _bookRepository.Add(book);
        return Ok(book);
    }

    [HttpGet]
    public List<Book> GetAll()
    {
        return _bookRepository.GetAll();
    }

    [HttpDelete]
    public bool Delete(Book book)
    {
        _bookRepository.Delete(book);
        return true;
    }

    [HttpPut("{id}")]
    public string Updated(Book book)
    {
        _bookRepository.Update(book);
        return "Updated ";
    }
}


