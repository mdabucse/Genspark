using System.Collections.Specialized;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Task_10.Models;

namespace Task_10.Controllers;


[ApiController]
[Route("api/[controller]")]
public class Students : ControllerBase
{
     private static List<Student> students = new()
    {
        new Student { Id = 1, Name = "Abu", Age = 22 }
    };

    [HttpGet]
    public IActionResult GetStudents()
    {
        return Ok(students);
    }

    [HttpPost]
    public IActionResult AddStudent([FromBody] Student student)
    {
        students.Add(student);
        return Ok(student);
    }

    [HttpPut]
    public IActionResult UpdateStudent([FromBody] Student student)
    {
        var existing = students.FirstOrDefault(s => s.Id == student.Id);
        if (existing==null)
        {
            return NotFound("Student not found");
        }
        existing.Id = student.Id;
        existing.Name = student.Name;
        existing.Age = student.Age;
        return Ok(student);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteStudent(int id)
    {
        var  existing = students.FirstOrDefault(s=> s.Id == id);
        if (existing == null)
        {
            return NotFound("No User Found");
        }
        students.Remove(existing);
        return Ok("Deleted");
    }
}