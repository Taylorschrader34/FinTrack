using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class Tag : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }

    public ICollection<TransactionTag> TransactionTags { get; set; }
}
