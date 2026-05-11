using System;
using System.Text;

namespace Game.Services
{
    internal class FeedbackGenerator
    {
        public string hiddenWord, guessWord;

        public FeedbackGenerator(string hiddenWord,string guessWord)
        {
            this.hiddenWord = hiddenWord;
            this.guessWord = guessWord;
        }

        public string GenerateFeedback()
        {
            StringBuilder feedback = new StringBuilder();

            for (int i = 0; i < hiddenWord.Length; i++)
            {
                if (hiddenWord[i] == guessWord[i])
                {
                    feedback.Append('G');
                }
                else if (hiddenWord.Contains(guessWord[i]))
                {
                    feedback.Append('Y');
                }
                else
                {
                    feedback.Append('X');
                }
            }

            return feedback.ToString();
        }

        public void PrintColoredFeedback(string feedback)
        {
            foreach (char c in feedback)
            {
                if (c == 'G')
                {
                    Console.ForegroundColor = ConsoleColor.Green;
                }
                else if (c == 'Y')
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                }

                Console.Write(c);
            }

            Console.ResetColor();
            Console.WriteLine();
        }
    }
}