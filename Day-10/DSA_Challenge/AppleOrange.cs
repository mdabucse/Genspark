static void countApplesAndOranges(
    int s,
    int t,
    int a,
    int b,
    List<int> apples,
    List<int> oranges)
{
    int appleCount = 0;
    int orangeCount = 0;

    // Check apples
    for (int i = 0; i < apples.Count; i++)
    {
        int applePosition = a + apples[i];

        if (applePosition >= s && applePosition <= t)
        {
            appleCount++;
        }
    }

    // Check oranges
    for (int i = 0; i < oranges.Count; i++)
    {
        int orangePosition = b + oranges[i];

        if (orangePosition >= s && orangePosition <= t)
        {
            orangeCount++;
        }
    }

    Console.WriteLine(appleCount);
    Console.WriteLine(orangeCount);
}