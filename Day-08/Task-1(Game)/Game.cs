using System;
using Game.Services;
using Game.Models;
using Game.Exceptions;

namespace Game.Starter
{
    internal class GameEngine
    {
        public void Starter()
        {
            // Create the Game State
            GameState user = new GameState();

            // Generate Hidden Word
            user.HiddenWord = WordProvider.GetRandomWord();

            // Difficulty Selection
            Console.WriteLine("Select Difficulty Level");
            Console.WriteLine("1. Easy");
            Console.WriteLine("2. Medium");
            Console.WriteLine("3. Hard");

            string choice = Console.ReadLine() ?? "";

            switch (choice)
            {
                case "1":
                    user.Difficulty = DifficultyLevel.Easy;
                    user.MaxAttempts = 8;
                    break;

                case "2":
                    user.Difficulty = DifficultyLevel.Medium;
                    user.MaxAttempts = 6;
                    break;

                case "3":
                    user.Difficulty = DifficultyLevel.Hard;
                    user.MaxAttempts = 4;
                    break;

                default:
                    Console.WriteLine("Invalid choice. Defaulting to Medium.");
                    user.Difficulty = DifficultyLevel.Medium;
                    user.MaxAttempts = 6;
                    break;
            }

            // Create Validator
            GuessValidator validator = new GuessValidator();

            // Game Loop
            while (user.CurrentAttempt <= user.MaxAttempts && !user.IsGameWon
            )
            {
                try
                {
                    Console.WriteLine($"Attempt {user.CurrentAttempt} of {user.MaxAttempts}");

                    Console.WriteLine("Please Enter the Guessed Word");

                    string guessWord =Console.ReadLine()?.ToUpper() ?? "";

                    // Validate Guess
                    validator.Validate(guessWord);

                    // Check Duplicate Guess
                    if (user.visitedWords.Contains(guessWord))
                    {
                        throw new InvalidGuessException("You already guessed this word.");
                    }

                    // Store Guess
                    user.visitedWords.Add(guessWord);

                    // Generate Feedback
                    FeedbackGenerator feedbackGenerator = new FeedbackGenerator(user.HiddenWord,guessWord);

                    string feedback =
                        feedbackGenerator.GenerateFeedback();

                    // Print Colored Feedback
                    feedbackGenerator.PrintColoredFeedback(feedback);

                    // Check Win
                    if (guessWord == user.HiddenWord)
                    {
                        user.IsGameWon = true;

                        // Score Calculation
                        user.Score = 100 - ((user.CurrentAttempt - 1) * 20);

                        switch (user.CurrentAttempt)
                        {
                            case 1:
                                Console.WriteLine("Genius!");
                                break;

                            case 2:
                                Console.WriteLine("Excellent!");
                                break;

                            case 3:
                                Console.WriteLine("Great job!");
                                break;

                            case 4:
                                Console.WriteLine("Good work!");
                                break;

                            case 5:
                                Console.WriteLine("Nice try!");
                                break;

                            case 6:
                                Console.WriteLine("That was close!");
                                break;
                        }

                        Console.WriteLine($"Your Score: {user.Score}");
                        Console.WriteLine("Congrats! You Won the Game ✌️");
                        break;
                    }

                    // Increment Attempt
                    user.CurrentAttempt++;
                }
                catch (InvalidGuessException e)
                {
                    Console.WriteLine(e.Message);
                }
            }

            // Game Over
            if (!user.IsGameWon)
            {
                Console.WriteLine($"Game Over! The hidden word was {user.HiddenWord}");
            }
        }
    }
}