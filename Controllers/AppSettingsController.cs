using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("[controller]")]
public class AppSettingsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AppSettingsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    [HttpGet("GetAppSettings")]
    public IActionResult GetAppSettings()
    {
        var appSettings = new
        {
            environment = _configuration["Environment"]
        };

        return Ok(appSettings);
    }
}
