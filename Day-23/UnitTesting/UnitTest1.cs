using NUnit.Framework;
using utils;

namespace UnitTesting;

public class Tests
{
    [Test]
    public void AddTwoNumbers_ReturnsSum()
    {
        Assert.That(7, Is.EqualTo(Add.AddTwoNumbers(5, 2)));
    }

    [Test]
    public void SubTwoNumbers_ReturnsDifference()
    {
        Assert.That(5, Is.EqualTo(Sub.SubTwoNumbers(10, 5)));
    }

    [Test]
    public void MultiplyTwoNumbers_ReturnsProduct()
    {
        Assert.That(50, Is.EqualTo(Multiply.MultiplyTwoNumbers(5, 10)));
    }

    [Test]
    public void DivideTwoNumbers_ReturnsQuotient()
    {
        Assert.That(2, Is.EqualTo(Divide.DivideTwoNumbers(10, 5)));
    }

    [Test]
    public void DivideTwoNumbers_ByZero_ThrowsDivideByZeroException()
    {
        Assert.Throws<DivideByZeroException>(() => Divide.DivideTwoNumbers(10, 0));
    }
}
