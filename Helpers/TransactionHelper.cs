
using FinTrack.Data;
using FinTrack.Models;

namespace FinTrack.Helpers;
public class TransactionHelper
{
    public static Transaction UpdateOrCreateNewTransaction(ApiDbContext _dbContext, TransactionInputModel transactionInput, Source source, Category category)
    {
        Transaction transaction = TransactionHelper.GetExistingTransaction(_dbContext, transactionInput.TransactionId);

        transaction.TransactionDate = new DateTime(
                        transactionInput.TransactionDate.Year,
                        transactionInput.TransactionDate.Month,
                        transactionInput.TransactionDate.Day,
                        0, 0, 0, DateTimeKind.Unspecified)
                        .ToUniversalTime();
        transaction.Amount = transactionInput.Amount;
        transaction.Description = transactionInput.Description;
        transaction.Source = source;
        transaction.Category = category;

        if (transactionInput.TransactionId == 0)
        {
            _dbContext.Transaction.Add(transaction);
        }
        else
        {
            _dbContext.Transaction.Update(transaction);
        }

        return transaction;
    }

    public static Transaction GetExistingTransaction(ApiDbContext _dbContext, int transactionId)
    {
        Transaction existingTransaction = _dbContext.Transaction.FirstOrDefault(t => t.Id == transactionId);

        return (existingTransaction != null ? existingTransaction : new Transaction());
    }
}