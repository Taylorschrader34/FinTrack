
using FinTrack.Data;
using FinTrack.Models;

namespace FinTrack.Helpers;
public class CategoryHelper
{

    public static Category GetExistingOrCreateNewCategory(ApiDbContext _dbContext, TransactionInputModel transactionInput)
    {

        Category category = CategoryHelper.GetExistingCategory(_dbContext, transactionInput.Category);

        //Create new Category if needed
        if (category == null)
        {
            category = CreateNewCategory(_dbContext, transactionInput);
        }

        return category;
    }

    public static Category GetExistingCategory(ApiDbContext _dbContext, Category category)
    {
        Category existingCategory = null;

        // Check if passing in existing Category
        if (category.Id != 0)
        {
            existingCategory = _dbContext.Category.FirstOrDefault(s => s.Id == category.Id);
        }
        else
        {
            // Check if the category name already exists in the database
            existingCategory = _dbContext.Category.FirstOrDefault(s => s.Name.Equals(category.Name));
        }

        return existingCategory;
    }

    public static Category CreateNewCategory(ApiDbContext _dbContext, TransactionInputModel transactionInput)
    {
        Category newCategory = new Category();
        newCategory.Name = transactionInput.Category.Name;
        newCategory.Description = transactionInput.Category.Description;

        _dbContext.Category.Add(newCategory);

        return newCategory;
    }
}