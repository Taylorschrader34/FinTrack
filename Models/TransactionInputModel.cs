using FinTrack.Models;

public class TransactionInputModel
{
    public DateTime TransactionDate { get; set; }
    public double Amount { get; set; }
    public string Description { get; set; }
    public Source Source { get; set; }
    public Category Category { get; set; }
}
