using BankingAPI.Interfaces;
using BankingAPI.Models;
using BankingAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [Authorize]
        [HttpPost("Transfer")]
        public ActionResult<TransactionResponse> Transfer(TransferRequest request)
        {
            try
            {
                var result = _transactionService.Transfer(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("Account/{accountNumber}/Log")]
        public ActionResult<List<Transaction>> GetAccountTransactions(string accountNumber)
        {
            try
            {
                var transactions = _transactionService.GetTransactionsForAccount(accountNumber);
                if (transactions == null || transactions.Count == 0)
                    return NotFound($"No transactions found for account {accountNumber}");

                return Ok(transactions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
