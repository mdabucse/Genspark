using System.Diagnostics.Contracts;

namespace Abstraction
{
    abstract class Payment
    {
        public abstract void Pay(); 
    }
    class CreditCard : Payment
    {
        public override void Pay()
        {
            System.Console.WriteLine("This Amount Debited by Credit Card");
        }
    }
    class UPI : Payment
    {
        public override void Pay()
        {
            System.Console.WriteLine("This Amount Debited by UPI");
        }
    }
}