public class SingleTon
{
    public void AddStudent(string name)
    {
        // Validation
        if (string.IsNullOrEmpty(name))
        {
            Console.WriteLine("Name is required");
            return;
        }

        // Business Logic
        Console.WriteLine($"Creating student: {name}");

        // Database Logic
        Console.WriteLine("Saving student to database");

        // Logging
        Console.WriteLine("Student added successfully");
    }
    public static void Main(string[] args)
    {
        StudentController controller = new StudentController();
        controller.AddStudent("John Doe");
        // var controller = new StudentController();
        // controller.AddStudent("Abubakkar");
    }
}