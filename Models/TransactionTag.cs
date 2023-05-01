using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class TransactionTag : BaseEntity
{
    public int TransactionId { get; set; }
    public Transaction Transaction { get; set; }

    public int TagId { get; set; }
    public Tag Tag { get; set; }
}

