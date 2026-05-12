using EfPractice.DAL;
using EfPractice.BL;
using EfPractice.Model;
using System.Diagnostics;

namespace EfPractice.FE
{
    public class Program
    {
        public static void Main(string [] args)
        {
            Employee emp;
            EmployeeRepo repo;
            InputsFromUser First;
            System.Console.WriteLine("Enter ");
            int n = Convert.ToInt32(Console.ReadLine());
            switch (n)
            {
                case 1:
                    emp = new Employee();
                    repo = new EmployeeRepo();
                    First = new InputsFromUser();
                    emp = First.GetInputs();
                    repo.InsertEmployee(emp);
                    break;
                case 2:
                    emp = new Employee();
                    repo = new EmployeeRepo();
                    First = new InputsFromUser();
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

            }

        }
    }
}