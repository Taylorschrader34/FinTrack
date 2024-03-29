using FinTrack.Models;

public class TransactionInputModel
{
    public int TransactionId { get; set; }
    public DateTime TransactionDate { get; set; }
    public double Amount { get; set; }
    public string Description { get; set; }
    public Source Source { get; set; }
    public Category Category { get; set; }
    public ICollection<Refund> Refunds { get; set; }
    public ICollection<Tag> Tags { get; set; }

}
