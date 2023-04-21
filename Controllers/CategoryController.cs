using Microsoft.AspNetCore.Mvc;
using FinTrack.Models;
using Microsoft.EntityFrameworkCore;
using FinTrack.Data;

namespace FinTrack.Controllers;

[ApiController]
[Route("[controller]")]
public class CategoryController : ControllerBase
{

    private readonly ILogger<CategoryController> _logger;
    private readonly ApiDbContext _dbContext;

    public CategoryController(ILogger<CategoryController> logger, ApiDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    // Create a new Category
    // [HttpPost("CreateCategory")]
    // public async Task<Category> CreateCategory([FromBody] Category category)
    // {
    //     _dbContext.Category.Add(category);
    //     await _dbContext.SaveChangesAsync();
    //     return category;
    // }

    // Read all Category
    [HttpGet("GetAllCategories")]
    public async Task<List<Category>> GetAllCategories()
    {
        return await _dbContext.Category.ToListAsync();
    }

    // Read a single Category by Id
    // [HttpGet("GetCategoryById")]
    // public async Task<Category> GetCategoryById(int id)
    // {
    //     return await _dbContext.Category.FindAsync(id);
    // }

    // Update an existing Source
    // [HttpPut("UpdateCategory")]
    // public async Task UpdateCategory([FromBody] Category category)
    // {
    //     _dbContext.Entry(category).State = EntityState.Modified;
    //     await _dbContext.SaveChangesAsync();
    // }

    // Delete an existing Category
    // [HttpDelete("DeleteCategory")]
    // public async Task DeleteCategory(int id)
    // {
    //     var category = await _dbContext.Category.FindAsync(id);
    //     _dbContext.Category.Remove(category);
    //     await _dbContext.SaveChangesAsync();
    // }
}
