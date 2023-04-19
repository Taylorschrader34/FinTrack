using Microsoft.AspNetCore.Mvc;
using FinTrack.Models;
using Microsoft.EntityFrameworkCore;
using FinTrack.Data;

namespace FinTrack.Controllers;

[ApiController]
[Route("[controller]")]
public class IncomeTransactionController : ControllerBase
{

    private readonly ILogger<IncomeTransactionController> _logger;
    private readonly ApiDbContext _dbContext;

    public IncomeTransactionController(ILogger<IncomeTransactionController> logger, ApiDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    // Create a new IncomeTransaction
    [HttpPost]
    public async Task<IncomeTransaction> CreateIncomeTransaction(IncomeTransaction incomeTransaction)
    {
        _dbContext.IncomeTransaction.Add(incomeTransaction);
        await _dbContext.SaveChangesAsync();
        return incomeTransaction;
    }

    // Read all IncomeTransactions
    [HttpGet]
    public async Task<List<IncomeTransaction>> GetAllIncomeTransactions()
    {
        return await _dbContext.IncomeTransaction.ToListAsync();
    }

    // Read a single IncomeTransaction by Id
    [HttpGet]
    public async Task<IncomeTransaction> GetIncomeTransactionById(int id)
    {
        return await _dbContext.IncomeTransaction.FindAsync(id);
    }

    // Update an existing IncomeTransaction
    [HttpPut]
    public async Task UpdateIncomeTransaction(IncomeTransaction incomeTransaction)
    {
        _dbContext.Entry(incomeTransaction).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    // Delete an existing IncomeTransaction
    [HttpDelete]
    public async Task DeleteIncomeTransaction(int id)
    {
        var incomeTransaction = await _dbContext.IncomeTransaction.FindAsync(id);
        _dbContext.IncomeTransaction.Remove(incomeTransaction);
        await _dbContext.SaveChangesAsync();
    }
}
