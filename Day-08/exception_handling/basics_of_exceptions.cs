using System.Globalization;

namespace basics
{
    class AgeError : Exception
    {
        public  AgeError(String message)
        {
            System.Console.WriteLine("The Age should be greater than 18");
        }
    }
}