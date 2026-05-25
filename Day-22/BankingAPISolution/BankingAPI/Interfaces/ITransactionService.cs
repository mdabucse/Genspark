using BankingAPI.Models;
using BankingAPI.Models.DTOs;
using System.Collections.Generic;

namespace BankingAPI.Interfaces
{
    public interface ITransactionService
    {
        public TransactionResponse Transfer(TransferRequest request);
        public List<Transaction> GetTransactionsForAccount(string accountNumber);
    }
}
