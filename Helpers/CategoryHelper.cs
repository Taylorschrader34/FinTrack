
using FinTrack.Data;
using FinTrack.Models;

namespace FinTrack.Helpers;
public class CategoryHelper
{
    public static Category GetExistingCategory(ApiDbContext dbContext, Category category)
    {
        Category existingCategory = null;

        // Check if passing in existing source
        if (category.Id != 0)
        {
            existingCategory = dbContext.Category.FirstOrDefault(c => c.Id == category.Id);
        }
        else
        {
            // Check if the source name already exists in the database
            existingCategory = dbContext.Category.FirstOrDefault(c => c.Name.Equals(category.Name));
        }

        return existingCategory;
    }
}