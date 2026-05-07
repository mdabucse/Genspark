using System;

namespace ExtensionAndDelegates.Delegates
{
    //Eg For Single Delegate
    class OneDelegates
    {
        public delegate void DownloadStatus(); // Initialize the delegate

        public void Notify()
        {
            System.Console.WriteLine("Downloaded Successfully");
        }

        public void downloading(DownloadStatus function)
        {
            System.Console.WriteLine("Download Started");
            Thread.Sleep(3000);
            function(); // Function calling Occur
        } 
        public void main()
        {
            downloading(Notify);  // here we passind the function as a param not calling
        }
    }

    // Multiple Delegates
    class MultipleDelegates
    {
        public delegate void Notification();
        public void mail()
        {
            System.Console.WriteLine("Mail Sent");
        }
        public void mess()
        {
            System.Console.WriteLine("Mess Sent");
        }

        public void main()
        {
            Notification n = mess;
            n+=mail;
            n();
        }
    }
}