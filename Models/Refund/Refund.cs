using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class Refund : BaseEntity
{
    public int TransactionId { get; set; }
    public double Amount { get; set; }
    public DateTime RefundDate { get; set; }
    public string Description { get; set; } = "";
    public virtual Transaction Transaction { get; set; }
}