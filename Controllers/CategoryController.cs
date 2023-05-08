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

    // Read all Category
    [HttpGet("GetAllCategories")]
    public async Task<List<Category>> GetAllCategories()
    {
        return await _dbContext.Category.ToListAsync();
    }

}
