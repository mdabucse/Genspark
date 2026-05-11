using System;
using Game.Starter;

namespace Game
{
    internal class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                System.Console.WriteLine("-----Welcome Word Game-----");
                System.Console.WriteLine("If you want Play the Game Enter 1 for exit Enter 0");
                int key = Convert.ToInt32(Console.ReadLine());
                if (key == 1)
                {
                    GameEngine game = new GameEngine();
                    game.Starter();
                }
                else
                {
                    break;
                }
            }

        }
    }
}