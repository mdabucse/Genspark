using System;
using EfPractice.Model;


namespace EfPractice.BL
{
    public class InputsFromUser
    {
        Employee First;
        public InputsFromUser()
        {
            First = new Employee();
        }

        public Employee GetInputs()
        {
            System.Console.WriteLine("Enter Name");
            First.Name = Console.ReadLine() ?? "";

            System.Console.WriteLine("Enter Email");
            First.Email = Console.ReadLine() ?? "";

            System.Console.WriteLine("Enter Phone");
            First.Phone = Console.ReadLine() ?? "";

            return First;

        }   
            public Employee GetUpdatedEmployee()
            {
                Employee emp = new Employee();

                Console.WriteLine("Enter Employee Id:");
                emp.Id = Convert.ToInt32(Console.ReadLine());

                Console.WriteLine("Enter Employee Name:");
                emp.Name = Console.ReadLine() ?? "";

                Console.WriteLine("Enter Employee Email:");
                emp.Email = Console.ReadLine() ?? "";

                Console.WriteLine("Enter Employee Phone:");
                emp.Phone = Console.ReadLine() ?? "";

                return emp;
            }

    }
}


