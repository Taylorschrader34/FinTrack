
using FinTrack.Data;
using FinTrack.Models;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Helpers;
public class TransactionHelper
{
    public static async Task<Transaction> UpdateOrCreateNewTransactionAsync(ApiDbContext _dbContext, TransactionInputModel transactionInput, Source source, Category category)
    {

        //TODO refactor this?
        Transaction transaction = await TransactionHelper.GetExistingTransactionAsync(_dbContext, transactionInput.TransactionId);
        var isEdit = false;
        if (transaction == null)
        {
            // Transaction does not exist, so create a new one.
            transaction = new Transaction();
            _dbContext.Transaction.Add(transaction);
        }
        else
        {
            isEdit = true;
        }

        transaction.TransactionDate = new DateTime(
            transactionInput.TransactionDate.Year,
            transactionInput.TransactionDate.Month,
            transactionInput.TransactionDate.Day,
            0, 0, 0, DateTimeKind.Unspecified).ToUniversalTime();
        transaction.Amount = transactionInput.Amount;
        transaction.Description = transactionInput.Description;
        transaction.Source = source;
        transaction.Category = category;
        _dbContext.SaveChanges();

        if (!isEdit)
        {
            await setTransactionTagsAsync(_dbContext, transactionInput.Tags, transaction.Id);
        }

        return transaction;
    }

    public static async Task<Transaction> GetExistingTransactionAsync(ApiDbContext _dbContext, int transactionId)
    {
        return await _dbContext.Transaction.FindAsync(transactionId);
    }

    public static async Task setTransactionTagsAsync(ApiDbContext _dbContext, ICollection<Tag> Tags, int transactionId)
    {

        // Get existing tags associated with the transaction.
        // var existingTags = await _dbContext.TransactionTags
        //     .Where(tt => tt.TransactionId == transactionId)
        //     .Select(tt => tt.Tag)
        //     .ToListAsync();

        // Get the IDs of the new tags.
        var tagIds = Tags.Select(t => t.Id).Where(id => id != 0).ToList();
        // Remove associations with tags that are not in the input list.

        // foreach (var tag in existingTags)
        // {
        //     if (!tagIds.Contains(tag.Id))
        //     {
        //         var transactionTag = await _dbContext.TransactionTags
        //             .FirstOrDefaultAsync(tt => tt.TransactionId == transactionId && tt.TagId == tag.Id);

        //         if (transactionTag != null)
        //         {
        //             _dbContext.TransactionTags.Remove(transactionTag);
        //             _dbContext.SaveChanges();
        //         }
        //     }
        // }

        // Add associations with tags that are in the input list but not in the existing tags.
        foreach (var tagId in tagIds)
        {
            // if (!existingTags.Any(tag => tag.Id == tagId))
            // {
            var tag = await _dbContext.Tags.FindAsync(tagId);
            var transactionTag = new TransactionTag();
            transactionTag.TransactionId = transactionId;
            transactionTag.TagId = tag.Id;
            _dbContext.TransactionTags.Add(transactionTag);
            _dbContext.SaveChanges();
            // }
        }

        // Create new tags
        var newTags = new List<Tag>();
        foreach (var tagInput in Tags)
        {
            if (tagInput.Id == 0)
            {
                var newTag = new Tag
                {
                    Name = tagInput.Name,
                    Description = tagInput.Description
                };
                newTags.Add(newTag);
                _dbContext.Tags.Add(newTag);
                _dbContext.SaveChanges();
            }
        }

        // Add new tags to transaction
        foreach (var tag in newTags)
        {
            var transactionTag = new TransactionTag();
            transactionTag.TransactionId = transactionId;
            transactionTag.TagId = tag.Id;
            _dbContext.TransactionTags.Add(transactionTag);
            _dbContext.SaveChanges();
        }
    }

}