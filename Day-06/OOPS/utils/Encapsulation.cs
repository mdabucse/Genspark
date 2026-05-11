namespace Encapsulation
{
    class Amount
    {
        private double amount; // Private variable

        // Create the Getter and setter values
        // Public method to set the value of amount
        public void SetAmount(double amount)
        {
            if (amount >= 0)
            {
                this.amount = amount;
            }
            else
            {
                Console.WriteLine("Amount cannot be negative.");
            }
        }

        // Public method to get the value of amount
        public double GetAmount()
        {
            return this.amount;
        }
    }
}