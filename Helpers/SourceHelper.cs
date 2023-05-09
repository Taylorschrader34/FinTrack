
using FinTrack.Data;
using FinTrack.Models;

namespace FinTrack.Helpers;
public class SourceHelper
{

    public static Source GetExistingOrCreateNewSoure(ApiDbContext _dbContext, TransactionInputModel transactionInput)
    {

        Source source = SourceHelper.GetExistingSource(_dbContext, transactionInput.Source);

        //Create new Source if needed
        if (source == null)
        {
            source = CreateNewSource(_dbContext, transactionInput);
        }

        return source;
    }

    public static Source GetExistingSource(ApiDbContext _dbContext, Source source)
    {
        Source existingSource = null;

        // Check if passing in existing source
        if (source.Id != 0)
        {
            existingSource = _dbContext.Source.FirstOrDefault(s => s.Id == source.Id);
        }
        else
        {
            // Check if the source name already exists in the database
            existingSource = _dbContext.Source.FirstOrDefault(s => s.Name.Equals(source.Name));
        }

        return existingSource;
    }

    public static Source CreateNewSource(ApiDbContext _dbContext, TransactionInputModel transactionInput)
    {
        Source newSource = new Source();
        newSource.Name = transactionInput.Source.Name;
        newSource.Description = transactionInput.Source.Description;

        _dbContext.Source.Add(newSource);

        return newSource;
    }
}