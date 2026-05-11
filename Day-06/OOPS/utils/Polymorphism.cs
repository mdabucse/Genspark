namespace Polymorphism
{
    class Account
    {
        public float Balance { get; set; }

        public void Deposit(float amount)
        {
            Balance += amount;
        }

        public virtual void CalculateInterest() // Base overridable method
        {
            Console.WriteLine("No interest");
        }
    }

    class SavingsAccount : Account
    {
        public float InterestRate { get; set; }

        public override void CalculateInterest()
        {
            float interest = Balance * InterestRate / 100;
            Console.WriteLine($"Savings Interest: {interest}");
        }
    }

    class CurrentAccount : Account
    {
        public override void CalculateInterest()
        {
            Console.WriteLine("No interest for current account");
        }
    }

}