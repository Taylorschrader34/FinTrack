using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class IncomeTransaction : BaseEntity
{
    public DateTime TransactionDate { get; set; }
    public int SourceId { get; set; }
    public int CategoryId { get; set; }
    public double Amount { get; set; }
    public string Description { get; set; } = "";
    public virtual Source Source { get; set; }
    public virtual Category Category { get; set; }

}