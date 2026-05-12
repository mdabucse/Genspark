using System;

namespace GameWithDb.Exceptions
{
    public class InvalidGuessException : Exception
    {
        public InvalidGuessException(string message): base(message){}
    }
}