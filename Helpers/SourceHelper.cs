
using FinTrack.Data;
using FinTrack.Models;

namespace FinTrack.Helpers;
public class SourceHelper
{

    public static Source GetExistingSource(ApiDbContext dbContext, Source source)
    {
        Source existingSource = null;

        // Check if passing in existing source
        if (source.Id != 0)
        {
            existingSource = dbContext.Source.FirstOrDefault(s => s.Id == source.Id);
        }
        else
        {
            // Check if the source name already exists in the database
            existingSource = dbContext.Source.FirstOrDefault(s => s.Name.Equals(source.Name));
        }

        return existingSource;
    }
}