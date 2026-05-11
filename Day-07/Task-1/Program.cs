using Users;
using Accounts;
using UsersRepo;
using CRUD;


class Program
{
    static void Main(string[] args)
    {
        AccountRepository accountRepository = new AccountRepository();
        UserRepository userRepository = new UserRepository();


        while (true)
        {
            Console.WriteLine("\n===== ACCOUNT MENU =====");
            Console.WriteLine("1. Create Account");
            Console.WriteLine("2. View Account");
            Console.WriteLine("3. Update Account");
            Console.WriteLine("4. Delete Account");
            Console.WriteLine("5. Exit");
            Console.Write("Enter your choice: ");

            int choice = int.Parse(Console.ReadLine() ?? "0");

            switch (choice)
            {
                case 1:
                    CRUDOperations.CreateAccount(accountRepository, userRepository);
                    break;

                case 2:
                    CRUDOperations.ViewAccount(accountRepository, userRepository);
                    break;

                case 3:
                    CRUDOperations.UpdateAccount(accountRepository, userRepository);
                    break;

                case 4:
                    CRUDOperations.DeleteAccount(accountRepository, userRepository);
                    break;

                case 5:
                    Console.WriteLine("Exiting...");
                    return;

                default:
                    Console.WriteLine("Invalid choice");
                    break;
            }
        }
    }

}