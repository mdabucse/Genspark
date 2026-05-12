using System;
using System.Collections.Generic;
using GameWithDb.BLL;
using GameWithDb.DAL;
using GameWithDb.Models;

namespace GameWithDb.FE
{
    internal class Program
    {
        static void Main(string[] args)
        {
            AuthenticationService authService =
                new AuthenticationService();

            ScoreRepository scoreRepository =
                new ScoreRepository();

            User? currentUser = null;

            // Authentication Loop
            while (currentUser == null)
            {
                Console.WriteLine("1. Register");
                Console.WriteLine("2. Login");
                Console.WriteLine("Choose an option");

                string choice =
                    Console.ReadLine() ?? "";

                Console.WriteLine("Enter Username");

                string username =
                    Console.ReadLine() ?? "";

                Console.WriteLine("Enter Password");

                string password =
                    Console.ReadLine() ?? "";

                switch (choice)
                {
                    case "1":

                        bool registerResult =
                            authService.Register(
                                username,
                                password
                            );

                        if (registerResult)
                        {
                            Console.WriteLine(
                                "Registration Successful"
                            );
                        }
                        else
                        {
                            Console.WriteLine(
                                "Registration Failed"
                            );
                        }

                        break;

                    case "2":

                        currentUser =
                            authService.Login(
                                username,
                                password
                            );

                        if (currentUser != null)
                        {
                            Console.WriteLine(
                                $"Welcome {currentUser.Username}"
                            );
                        }
                        else
                        {
                            Console.WriteLine(
                                "Invalid Credentials"
                            );
                        }

                        break;

                    default:

                        Console.WriteLine(
                            "Invalid Option"
                        );

                        break;
                }
            }

            // Main Menu Loop
            bool exit = false;

            while (!exit)
            {
                Console.WriteLine();
                Console.WriteLine(
                    "1. Start Game"
                );

                Console.WriteLine(
                    "2. View Past Games"
                );

                Console.WriteLine(
                    "3. Exit"
                );

                Console.WriteLine(
                    "Choose an option"
                );

                string menuChoice =
                    Console.ReadLine() ?? "";

                switch (menuChoice)
                {
                    case "1":

                        Console.WriteLine(
                            "Starting Game..."
                        );

                        // Start GameEngine Here
                            GameEngine gameEngine = new GameEngine();
                            GameState result = gameEngine.Starter();

                        // Example Score Saving
                        Score score = new Score
                        {
                            UserId = currentUser.Id,
                            ScoreValue = result.Score,
                            Difficulty = result.Difficulty.ToString()
                        };

                        bool saved =
                            scoreRepository.SaveScore(
                                score
                            );

                        if (saved)
                        {
                            Console.WriteLine(
                                "Score Saved Successfully"
                            );
                        }

                        break;

                    case "2":

                        List<Score> scores =
                            scoreRepository
                                .GetScoresByUser(
                                    currentUser.Id
                                );

                        Console.WriteLine();
                        Console.WriteLine(
                            "Past Games"
                        );

                        foreach (Score item in scores)
                        {
                            Console.WriteLine(
                                $"Score : {item.ScoreValue}"
                            );

                            Console.WriteLine(
                                $"Difficulty : {item.Difficulty}"
                            );

                            Console.WriteLine(
                                $"Played At : {item.PlayedAt}"
                            );

                            Console.WriteLine(
                                "----------------------"
                            );
                        }

                        break;

                    case "3":

                        exit = true;

                        Console.WriteLine(
                            "Exiting Application..."
                        );

                        break;

                    default:

                        Console.WriteLine(
                            "Invalid Option"
                        );

                        break;
                }
            }
        }
    }
}