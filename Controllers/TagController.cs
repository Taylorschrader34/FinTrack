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
public class TagController : ControllerBase
{

    private readonly ILogger<TagController> _logger;
    private readonly ApiDbContext _dbContext;

    public TagController(ILogger<TagController> logger, ApiDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    public class TransactionTagInput
    {
        public int TagId { get; set; }
        public int TransactionId { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }

    // Read all tag
    [HttpGet("GetAllTags")]
    public async Task<ActionResult<List<Tag>>> GetAllTags()
    {
        var tags = await _dbContext.Tags.ToListAsync();
        if (tags == null || tags.Count == 0)
        {
            return NotFound();
        }
        return Ok(tags);
    }

    //Create a new Tag
    [HttpPost("CreateTransactionTag")]
    public async Task<Tag> CreateTransactionTag([FromBody] TransactionTagInput transactionTagInput)
    {
        var tag = new Tag();
        var transactionTag = new TransactionTag();
        if (transactionTagInput.TagId != 0)
        {
            transactionTag.TransactionId = transactionTagInput.TransactionId;
            transactionTag.TagId = transactionTagInput.TagId;
            _dbContext.TransactionTags.Add(transactionTag);
        }
        else
        {
            tag.Name = transactionTagInput.Name;
            tag.Description = transactionTagInput.Description;
            _dbContext.Tags.Add(tag);

            transactionTag.TransactionId = transactionTagInput.TransactionId;
            transactionTag.TagId = tag.Id;
            _dbContext.TransactionTags.Add(transactionTag);
        }

        await _dbContext.SaveChangesAsync();

        // Return the response in the Ok response
        return tag;
    }

    [HttpGet("GetTagById/{id}")]
    public async Task<Tag> GetTagById(int id)
    {
        var tag = await _dbContext.Tags.FindAsync(id);

        return tag;
    }

    [HttpDelete("DeleteTransactionTag/{transactionId}/{tagId}")]
    public async Task<IActionResult> DeleteTransactionTag(int transactionId, int tagId)
    {

        var transaction = await _dbContext.Transaction
             .Include(t => t.TransactionTags)
             .Where(t => t.Id == transactionId).FirstOrDefaultAsync();

        var transactionTag = transaction.TransactionTags.FirstOrDefault(r => r.TagId == tagId);

        if (transactionTag != null)
        {
            transaction.TransactionTags.Remove(transactionTag);
            _dbContext.SaveChanges();
        }

        return Ok();
    }

}
