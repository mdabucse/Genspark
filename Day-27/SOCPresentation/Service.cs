public class StudentService
{
    private readonly StudentRepository _repository;

    public StudentService()
    {
        _repository = new StudentRepository();
    }

    public void AddStudent(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            Console.WriteLine("Name is required");
            return;
        }

        Console.WriteLine($"Creating student: {name}");

        _repository.Save(name);
    }
}