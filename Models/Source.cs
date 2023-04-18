using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class Source : BaseEntity
{
    public Source()
    {
        IncomeTransactions = new HashSet<IncomeTransaction>();
        ExpenseTransactions = new HashSet<ExpenseTransaction>();
    }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";

    public virtual ICollection<IncomeTransaction> IncomeTransactions { get; set; }
    public virtual ICollection<ExpenseTransaction> ExpenseTransactions { get; set; }

}