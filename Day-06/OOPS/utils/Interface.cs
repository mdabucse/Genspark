namespace InterfaceClass
{
    interface IAnimal
    {
        void Sound();   // no body
    }
    class Dog : IAnimal
    {
        public void Sound()
        {
            Console.WriteLine("Dog barks");
        }
    }
    class Cat : IAnimal
    {
        public void Sound()
        {
            Console.WriteLine("Cat meows");
        }
    }
}