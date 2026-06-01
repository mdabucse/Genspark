public class StudentController
{
    private readonly StudentService _service;

    public StudentController()
    {
        _service = new StudentService();
    }

    public void AddStudent(string name)
    {
        _service.AddStudent(name);
    }
}