using Microsoft.AspNetCore.Mvc;
using FinTrack.Models;
using Microsoft.EntityFrameworkCore;
using FinTrack.Data;

namespace FinTrack.Controllers;

[ApiController]
[Route("[controller]")]
public class SourceController : ControllerBase
{

    private readonly ILogger<SourceController> _logger;
    private readonly ApiDbContext _dbContext;

    public SourceController(ILogger<SourceController> logger, ApiDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    // Read all Sources
    [HttpGet("GetAllSources")]
    public async Task<List<Source>> GetAllSources()
    {
        return await _dbContext.Source.OrderBy(s => s.Name).ToListAsync();
    }

}
