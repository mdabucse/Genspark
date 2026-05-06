using System;

namespace Game.Exceptions
{
    internal class InvalidGuessException : Exception
    {
        public InvalidGuessException(string message): base(message){}
    }
}