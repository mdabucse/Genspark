using System;
using ExtensionAndDelegates.Models;
namespace ExtensionAndDelegates.LINQ
{
    public class LINQ
    {
        public void LINQExamples()
        {
            List<int> integerList = new List<int>()
            {
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            };

            var val = from c in integerList
                      where c>5
                      select c;
            foreach(var i in val)
            {
                System.Console.WriteLine(i);
            }

            // IEnumerable fetch the data to main memory then process
            List<Student> studentList = new List<Student>()
            {
                new Student(){ID = 1, Name = "James", Gender = "Male"},
                new Student(){ID = 2, Name = "Sara", Gender = "Female"},
                new Student(){ID = 3, Name = "Steve", Gender = "Male"},
                new Student(){ID = 4, Name = "Pam", Gender = "Female"}
            };
            
            IEnumerable<Student> method = studentList.Where(obj=>obj.Gender=="Male");
            foreach(var i in method)
            {
                System.Console.WriteLine($"{i.ID} and {i.Gender}");
            }

            // IQuerayable process from the db and then fetch
            IQueryable<Student> MethodSyntax = studentList.AsQueryable()
                                .Where(std => std.Gender == "Male");
            foreach(var i in method)
            {
                System.Console.WriteLine($"{i.ID} and {i.Gender}");
            }
        }
    }
}