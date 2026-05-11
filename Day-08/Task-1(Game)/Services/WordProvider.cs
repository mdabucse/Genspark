using System;

namespace Game.Services
{
    internal class WordProvider
    {
        public static string GetRandomWord()
        {
            Random random = new Random();
            List<string> wordsValues = new List<string>()
            {
                "APPLE","MANGO","GRAPE","TRAIN","PLANT","BRAIN"
            };
            int randomIndex = random.Next(0,wordsValues.Count);

            return wordsValues[randomIndex];

        }
    }
}