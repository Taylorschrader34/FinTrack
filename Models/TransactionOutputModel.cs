using FinTrack.Models;

public class TransactionOutputModel
{
    public DateTime TransactionDate { get; set; }
    public double Amount { get; set; }
    public string Description { get; set; }
    public int SourceId { get; set; }
    public string SourceName { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
}
