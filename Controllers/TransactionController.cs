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

            // Check if passing in existing Source
            Source existingSource = SourceHelper.GetExistingSource(_dbContext, transactionInput.Source);

            // Check if passing in existing Category
            Category existingCategory = CategoryHelper.GetExistingCategory(_dbContext, transactionInput.Category);

            //Create new Source if needed
            Source newSource = new Source();
            if (existingSource == null)
            {
                newSource.Name = transactionInput.Source.Name;
                newSource.Description = transactionInput.Source.Description;

                _dbContext.Source.Add(newSource);
            }

            //Create new Category if needed
            Category newCategory = new Category();
            if (existingCategory == null)
            {
                newCategory.Name = transactionInput.Category.Name;
                newCategory.Description = transactionInput.Category.Description;

                _dbContext.Category.Add(newCategory);
            }

            //create transaction
            var transaction = new Transaction
            {
                TransactionDate = new DateTime(
                    transactionInput.TransactionDate.Year,
                    transactionInput.TransactionDate.Month,
                    transactionInput.TransactionDate.Day,
                    0, 0, 0, DateTimeKind.Unspecified)
                    .ToUniversalTime(),
                Amount = transactionInput.Amount,
                Description = transactionInput.Description,
                Source = existingSource ?? newSource,
                Category = existingCategory ?? newCategory
            };

            _dbContext.Transaction.Add(transaction);
            _dbContext.SaveChanges();

            string successMessage =
                newSource != null && newCategory != null ?
                "Transaction created successfully with new source and category." :
                newSource != null ?
                "Transaction created successfully with new source." :
                newCategory != null ?
                "Transaction created successfully with new category." :
                "Transaction created successfully.";

            // Create the response object with the transaction and success message
            var response = new
            {
                Message = successMessage,
                Transaction = transaction
            };

            var jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve // Use ReferenceHandler.Preserve to handle object cycles
            };
            var jsonResponse = JsonSerializer.Serialize(response, jsonOptions);

            // Return the response in the Ok response
            return Ok(jsonResponse);
        }
        catch (Exception ex)
        {
            // Handle any exceptions that may occur during the processing of the transaction
            return BadRequest("Failed to process transaction. Error: " + ex.Message);
        }
    }

    // Create a new Transaction
    // [HttpPost("CreateTransaction")]
    // public async Task<Transaction> CreateTransaction([FromBody] Transaction Transaction)
    // {
    //     _dbContext.Transaction.Add(Transaction);
    //     await _dbContext.SaveChangesAsync();
    //     return Transaction;
    // }

    // Read all Transactions
    [HttpGet("GetAllTransactions")]
    public async Task<List<TransactionOutputModel>> GetAllTransactions()
    {
        var transactions = await _dbContext.Transaction
            .Include(t => t.Source) // Include the Source entity
            .Include(t => t.Category) // Include the Category entity
            .ToListAsync();

        List<TransactionOutputModel> transactionOutputList = new List<TransactionOutputModel>();

        foreach(Transaction transaction in transactions){
            transactionOutputList.Add(new TransactionOutputModel(){
                TransactionDate = transaction.TransactionDate,
                Amount = transaction.Amount,
                Description = transaction.Description,
                SourceId = transaction.SourceId,
                SourceName = transaction.Source.Name,
                CategoryId = transaction.CategoryId,
                CategoryName = transaction.Category.Name
            });
        }

        return transactionOutputList;
    }

    // Read a single Transaction by Id
    // [HttpGet("GetTransactionById")]
    // public async Task<Transaction> GetTransactionById(int id)
    // {
    //     return await _dbContext.Transaction.FindAsync(id);
    // }

    // Update an existing Transaction
    // [HttpPut("UpdateTransaction")]
    // public async Task UpdateTransaction([FromBody] Transaction Transaction)
    // {
    //     _dbContext.Entry(Transaction).State = EntityState.Modified;
    //     await _dbContext.SaveChangesAsync();
    // }

    // Delete an existing Transaction
    // [HttpDelete("DeleteTransaction")]
    // public async Task DeleteTransaction(int id)
    // {
    //     var Transaction = await _dbContext.Transaction.FindAsync(id);
    //     _dbContext.Transaction.Remove(Transaction);
    //     await _dbContext.SaveChangesAsync();
    // }

}
