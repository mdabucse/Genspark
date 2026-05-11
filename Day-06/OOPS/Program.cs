using Encapsulation;
using System;
using Inheritance;
using Polymorphism;
using Abstraction;
using InterfaceClass;

class Program
{
    static void Main(string[] args)
    {
        // Encapsulation 
        Amount amt = new Amount();
        amt.SetAmount(10000);
        Console.WriteLine("The amount is: " + amt.GetAmount());

        //Inheritance
        Inheritance.SavingsAccount savings = new Inheritance.SavingsAccount();
        savings.AccountNumber = "SA123";
        savings.Deposit(5000);
        savings.InterestRate = 5;
        Console.WriteLine("\nInheritance:");
        Console.WriteLine($"Balance before interest: {savings.Balance}");
        savings.CalculateInterest();
        Console.WriteLine($"Balance after interest: {savings.Balance}");

        //Polymorphism
        Console.WriteLine("\nPolymorphism:");
        Polymorphism.SavingsAccount acc1 = new Polymorphism.SavingsAccount();
        Polymorphism.CurrentAccount acc2 = new Polymorphism.CurrentAccount();
        acc1.Balance = 5000;
        acc2.Balance = 5000;
        // Casting to access child property
        acc1.InterestRate = 5;
        acc1.CalculateInterest();   // Calls Savings version
        Console.WriteLine($"Final Savings Balance: {acc1.Balance}");
        Console.WriteLine($"Final Current Balance: {acc2.Balance}");

        // Abstraction
        Payment firstTransaction = new CreditCard();
        firstTransaction.Pay();
        Payment secondTransaction = new UPI();
        secondTransaction.Pay();

        // Interface
        IAnimal a1 = new Dog();
        IAnimal a2 = new Cat();
        a1.Sound();
        a2.Sound();









    }
}