using EfPractice.DAL;
using EfPractice.BL;
using EfPractice.Model;
using System.Diagnostics;

namespace EfPractice.FE
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Employee emp;
            EmployeeRepo repo;
            InputsFromUser First;

            Console.WriteLine("Choose an Operation");
            Console.WriteLine("1. Insert Employee");
            Console.WriteLine("2. Update Employee");
            Console.WriteLine("3. Delete Employee");
            Console.WriteLine("4. Get All Employees");

            Console.WriteLine("Enter Your Choice:");

            int n = Convert.ToInt32(Console.ReadLine());

            switch (n)
            {
                case 1:
                    emp = new Employee();
                    repo = new EmployeeRepo();
                    First = new InputsFromUser();
                    Console.WriteLine("Enter Employee Details");
                    emp = First.GetInputs();
                    repo.InsertEmployee(emp);
                    break;

                case 2:
                    emp = new Employee();
                    repo = new EmployeeRepo();
                    First = new InputsFromUser();
                    Console.WriteLine("Enter Updated Employee Details");
                    emp = First.GetUpdatedEmployee();
                    repo.UpdateEmployee(emp);
                    break;

                case 3:
                    emp = new Employee();
                    repo = new EmployeeRepo();
                    Console.WriteLine("Enter Employee Id To Delete:");
                    emp.Id = Convert.ToInt32(Console.ReadLine());
                    repo.DeleteEmployee(emp);
                    break;

                case 4:
                    repo = new EmployeeRepo();
                    Console.WriteLine("Employee Details");
                    repo.GetEmployee();
                    break;

                default:
                    Console.WriteLine("Invalid Choice");
                    break;
            }
        }
    }
}