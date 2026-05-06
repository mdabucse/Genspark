using System;
using Game.Exceptions;

namespace Game.Services
{
    internal class GuessValidator
    {
        public void Validate(string guess)
        {
            if (string.IsNullOrWhiteSpace(guess))
            {
                throw new InvalidGuessException(
                    "Guess cannot be empty."
                );
            }

            if (guess.Length != 5)
            {
                throw new InvalidGuessException(
                    "Guess must be exactly 5 letters long."
                );
            }

            foreach (char c in guess)
            {
                if (!char.IsLetter(c))
                {
                    throw new InvalidGuessException(
                        "Guess must contain only letters."
                    );
                }
            }
        }
    }
}