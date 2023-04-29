using Microsoft.AspNetCore.Mvc;
using FinTrack.Models;
using Microsoft.EntityFrameworkCore;
using FinTrack.Data;
using FinTrack.Helpers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FinTrack.Controllers;

[ApiController]
[Route("[controller]")]
public class TransactionController : ControllerBase
{

    private readonly ILogger<TransactionController> _logger;
    private readonly ApiDbContext _dbContext;

    public TransactionController(ILogger<TransactionController> logger, ApiDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    // Handle Creating new Transaction
    // Also checks for new or existing Source and Category
    [HttpPost("ProcessTransaction")]
    public ActionResult<string> ProcessTransaction([FromBody] TransactionInputModel transactionInput)
    {
        try
        {

            Source source = SourceHelper.GetExistingOrCreateNewSoure(_dbContext, transactionInput);

            Category category = CategoryHelper.GetExistingOrCreateNewCategory(_dbContext, transactionInput);

            Transaction transaction = TransactionHelper.UpdateOrCreateNewTransaction(_dbContext, transactionInput, source, category);

            _dbContext.SaveChanges();

            // Create the response object with the transaction and success message
            var response = new
            {
                Message = "Transaction created successfully.",
                Transaction = transaction
            };

            // Return the response in the Ok response
            return Ok(response);
        }
        catch (Exception ex)
        {
            // Handle any exceptions that may occur during the processing of the transaction
            return BadRequest("Failed to process transaction. Error: " + ex.Message);
        }
    }

    // Read all Transactions
    [HttpGet("GetAllTransactions")]
    public async Task<List<Transaction>> GetAllTransactions()
    {
        var transactions = await _dbContext.Transaction
            .Include(t => t.Source) // Include the Source entity
            .Include(t => t.Category) // Include the Category entity
            .Include(t => t.Refunds) // Include the Refund entity
            .ToListAsync();

        return transactions;
    }

    // Read Transaction between a date range
    [HttpGet("GetTransactionsByDateRange")]
    public async Task<List<Transaction>> GetTransactionsByDateRange(DateTime startDate, DateTime endDate)
    {
        var transactions = await _dbContext.Transaction
            .Include(t => t.Source) // Include the Source entity
            .Include(t => t.Category) // Include the Category entity
            .Where(t => t.TransactionDate >= startDate && t.TransactionDate <= endDate)
            .ToListAsync();

        return transactions;
    }

    //Get an existing Transaction by Id
    [HttpGet("GetTransactionById/{id}")]
    public async Task<Transaction> GetTransactionById(int id)
    {
        var transaction = await _dbContext.Transaction
            .Include(t => t.Source)
            .Include(t => t.Category)
            .Include(t => t.Refunds)
            .FirstOrDefaultAsync(t => t.Id == id);
        if (transaction == null)
        {
            return new Transaction();
        }

        return transaction;
    }

    //Delete an existing Transaction
    [HttpDelete("DeleteTransaction/{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var Transaction = await _dbContext.Transaction.FindAsync(id);
        if (Transaction == null)
        {
            return NotFound("Transaction not found");
        }
        _dbContext.Transaction.Remove(Transaction);
        await _dbContext.SaveChangesAsync();
        return Ok();
    }

}
