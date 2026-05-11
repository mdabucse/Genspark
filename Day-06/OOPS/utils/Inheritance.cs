namespace Inheritance
{
    class Account
    {
        public Account()
        {
            AccountNumber = string.Empty;
            Balance = 0.0;
        }
        public  string AccountNumber { get; set; }
        public double Balance { get; set; }

        public void Deposit(double amount)
        {
            Balance += amount;
        }

        public void Withdraw(double amount)
        {
            if (amount <= Balance)
            {
                Balance -= amount;
            }
            else
            {
                Console.WriteLine("Insufficient funds.");
            }
        }
    }
    
    class SavingsAccount : Account
    {
        public double InterestRate { get; set; }

        public void CalculateInterest()
        {
            double interest = Balance * InterestRate / 100;
            Deposit(interest);
        }
    }

    class CurrentAccount : Account
    {
        public double OverdraftLimit { get; set; }

        public new void Withdraw(double amount)
        {
            if (amount <= Balance + OverdraftLimit)
            {
                Balance -= amount;
            }
            else
            {
                Console.WriteLine("Overdraft limit exceeded.");
            }
        }
    }
}