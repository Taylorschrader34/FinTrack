using Microsoft.AspNetCore.Mvc;
using FinTrack.Models;
using Microsoft.EntityFrameworkCore;
using FinTrack.Data;

namespace FinTrack.Controllers;

[ApiController]
[Route("[controller]")]
public class ExpenseTransactionController : ControllerBase
{

    private readonly ILogger<ExpenseTransactionController> _logger;
    private readonly ApiDbContext _dbContext;

    public ExpenseTransactionController(ILogger<ExpenseTransactionController> logger, ApiDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    // Create a new ExpenseTransaction
    [HttpPost]
    public async Task<ExpenseTransaction> CreateExpenseTransaction(ExpenseTransaction expenseTransaction)
    {
        _dbContext.ExpenseTransaction.Add(expenseTransaction);
        await _dbContext.SaveChangesAsync();
        return expenseTransaction;
    }

    // Read all ExpenseTransactions
    [HttpGet]
    public async Task<List<ExpenseTransaction>> GetAllExpenseTransactions()
    {
        return await _dbContext.ExpenseTransaction.ToListAsync();
    }

    // Read a single ExpenseTransaction by Id
    [HttpGet]
    public async Task<ExpenseTransaction> GetExpenseTransactionById(int id)
    {
        return await _dbContext.ExpenseTransaction.FindAsync(id);
    }

    // Update an existing ExpenseTransaction
    [HttpPut]
    public async Task UpdateExpenseTransaction(ExpenseTransaction expenseTransaction)
    {
        _dbContext.Entry(expenseTransaction).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    // Delete an existing ExpenseTransaction
    [HttpDelete]
    public async Task DeleteExpenseTransaction(int id)
    {
        var expenseTransaction = await _dbContext.ExpenseTransaction.FindAsync(id);
        _dbContext.ExpenseTransaction.Remove(expenseTransaction);
        await _dbContext.SaveChangesAsync();
    }
}
