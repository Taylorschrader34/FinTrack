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
public class RefundController : ControllerBase
{

    private readonly ILogger<RefundController> _logger;
    private readonly ApiDbContext _dbContext;

    public RefundController(ILogger<RefundController> logger, ApiDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    public class RefundInput
    {
        public int id { get; set; }
        public int TransactionId { get; set; }
        public double Amount { get; set; }
        public DateTime RefundDate { get; set; }
        public string Description { get; set; } = "";
    }

    //Create a new Refund
    [HttpPost("CreateRefund")]
    public async Task<Refund> CreateRefund([FromBody] RefundInput refundInput)
    {
        var refund = new Refund();
        refund.Amount = refundInput.Amount;
        refund.Description = refundInput.Description;
        refund.TransactionId = refundInput.TransactionId;
        refund.RefundDate = refundInput.RefundDate;

        var transaction = await _dbContext.Transaction
            .Include(t => t.Refunds)
            .Where(t => t.Id == refund.TransactionId).FirstOrDefaultAsync();

        transaction.Refunds.Add(refund);
        await _dbContext.SaveChangesAsync();

        // Return the response in the Ok response
        return transaction.Refunds.Last();

    }

    //Edit a Refund
    [HttpPut("EditRefund")]
    public async Task<Refund> EditRefund([FromBody] RefundInput refundInput)
    {
        var transaction = await _dbContext.Transaction
             .Include(t => t.Refunds)
             .Where(t => t.Id == refundInput.TransactionId).FirstOrDefaultAsync();

        var refund = transaction.Refunds.FirstOrDefault(r => r.Id == refundInput.id);
        if (refund != null)
        {
            refund.Amount = refundInput.Amount;
            refund.Description = refundInput.Description;
            refund.RefundDate = refundInput.RefundDate;
            _dbContext.SaveChanges();
        }

        return refund;
    }

    [HttpGet("GetRefundById/{id}")]
    public async Task<Refund> GetRefundById(int id)
    {
        var refund = await _dbContext.Refunds.FindAsync(id);

        return refund;
    }

    [HttpDelete("DeleteRefund/{transactionId}/{refundId}")]
    public async Task<IActionResult> DeleteRefund(int transactionId, int refundId)
    {

        var transaction = await _dbContext.Transaction
             .Include(t => t.Refunds)
             .Where(t => t.Id == transactionId).FirstOrDefaultAsync();

        var refund = transaction.Refunds.FirstOrDefault(r => r.Id == refundId);

        if (refund != null)
        {
            transaction.Refunds.Remove(refund);
            _dbContext.SaveChanges();
        }

        return Ok();
    }

}
