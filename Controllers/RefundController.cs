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
        _dbContext.SaveChangesAsync();

        // Return the response in the Ok response
        return transaction.Refunds.Last();

    }

}
