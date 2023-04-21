using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class Category : BaseEntity
{
    public Category()
    {
        Transactions = new HashSet<Transaction>();
    }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";

    public virtual ICollection<Transaction> Transactions { get; set; }

}