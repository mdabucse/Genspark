namespace utils;
public class Divide
{
    public static int DivideTwoNumbers(int a, int b)
    {
        if(b == 0)
        {
            throw new DivideByZeroException("Cannot divide by zero");
        }
        return a / b;
    }
}