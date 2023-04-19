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

    // Create a new Source
    [HttpPost]
    public async Task<Source> CreateSource(Source source)
    {
        _dbContext.Source.Add(source);
        await _dbContext.SaveChangesAsync();
        return source;
    }

    // Read all Sources
    [HttpGet]
    public async Task<List<Source>> GetAllSources()
    {
        return await _dbContext.Source.ToListAsync();
    }

    // Read a single Source by Id
    [HttpGet]
    public async Task<Source> GetSourceById(int id)
    {
        return await _dbContext.Source.FindAsync(id);
    }

    // Update an existing Source
    [HttpPut]
    public async Task UpdateSource(Source source)
    {
        _dbContext.Entry(source).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    // Delete an existing Source
    [HttpDelete]
    public async Task DeleteSource(int id)
    {
        var source = await _dbContext.Source.FindAsync(id);
        _dbContext.Source.Remove(source);
        await _dbContext.SaveChangesAsync();
    }
}
