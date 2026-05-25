using BankingAPI.Interfaces;
using BankingAPI.Models;
using BankingAPI.Models.DTOs;
using BankingAPI.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BankingAPI.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IRepository<string, Account> _accountRepository;
        private readonly IRepository<int, Transaction> _transactionRepository;
        private readonly BankingContext _context;

        public TransactionService(IRepository<string, Account> accountRepository,
                                  IRepository<int, Transaction> transactionRepository,
                                  BankingContext context)
        {
            _accountRepository = accountRepository;
            _transactionRepository = transactionRepository;
            _context = context;
        }

        public TransactionResponse Transfer(TransferRequest request)
        {
            if (request.FromAccountNumber == request.ToAccountNumber)
                throw new ArgumentException("From and To account cannot be the same");

            var from = _accountRepository.Get(request.FromAccountNumber);
            var to = _accountRepository.Get(request.ToAccountNumber);
            if (from == null)
                throw new ArgumentException("From account not found");
            if (to == null)
                throw new ArgumentException("To account not found");
            if (from.Status != "Active" || to.Status != "Active")
                throw new ArgumentException("One of the accounts is not active");
            if (request.Amount <= 0)
                throw new ArgumentException("Amount must be positive");
            var tx = new Transaction()
            {
                TransactionDate = DateTime.Now,
                FromAccountNumber = request.FromAccountNumber,
                ToAccountNumber = request.ToAccountNumber,
                Status = "Pending"
            };

            using (var dbTrans = _context.Database.BeginTransaction())
            {
                try
                {
                    if (from.Balance < request.Amount)
                    {
                        tx.Status = "Failed - Insufficient Funds";
                        _transactionRepository.Create(tx);
                        dbTrans.Commit();
                        return MapToResponse(tx, from.Balance, to.Balance);
                    }

                    from.Balance -= request.Amount;
                    to.Balance += request.Amount;

                    _accountRepository.Update(from.AccountNumber, from);
                    _accountRepository.Update(to.AccountNumber, to);

                    tx.Status = "Success";
                    var created = _transactionRepository.Create(tx);
                    dbTrans.Commit();

                    return MapToResponse(created, from.Balance, to.Balance);
                }
                catch
                {
                    dbTrans.Rollback();
                    tx.Status = "Failed - Error";
                    _transactionRepository.Create(tx);
                    throw;
                }
            }
        }

        public List<Transaction> GetTransactionsForAccount(string accountNumber)
        {
            return _context.Transactions
                .Where(t => t.FromAccountNumber == accountNumber || t.ToAccountNumber == accountNumber)
                .OrderByDescending(t => t.TransactionDate)
                .ToList();
        }

        private TransactionResponse MapToResponse(Transaction tx, float fromBalance, float toBalance)
        {
            return new TransactionResponse
            {
                TransactionReferenceNumber = tx.TransactionReferenceNumber,
                TransactionDate = tx.TransactionDate,
                FromAccountNumber = tx.FromAccountNumber,
                ToAccountNumber = tx.ToAccountNumber,
                Status = tx.Status,
                FromBalance = fromBalance,
                ToBalance = toBalance
            };
        }
    }
}
