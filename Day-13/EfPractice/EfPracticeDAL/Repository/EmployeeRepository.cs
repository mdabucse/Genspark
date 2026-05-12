using EfPractice.Model;
using System;


namespace EfPractice.DAL
{
    public class EmployeeRepo
    {
        EmployeeContext employee;

        public EmployeeRepo()
        {
            employee = new EmployeeContext();
        }

        public void InsertEmployee(Employee emp)
        {
            employee.Add(emp);
            employee.SaveChanges();
            System.Console.WriteLine("Value Inserted Successfully");
        }
        public void UpdateEmployee(Employee emp)
        {
            employee.Update(emp);
            employee.SaveChanges();
            System.Console.WriteLine("Value Updated Successfully");
        }

        public void DeleteEmployee(Employee emp)
        {
            employee.Remove(emp);
            employee.SaveChanges();
            System.Console.WriteLine("Value Removed Successfully");
        }

        public void GetEmployee()
        {
            var employees = employee.employees;

            foreach (var item in employees)
            {
                Console.WriteLine(
                    $"Id: {item.Id} Name: {item.Name} Email: {item.Email}"
                );
            }
        }
    }
}

