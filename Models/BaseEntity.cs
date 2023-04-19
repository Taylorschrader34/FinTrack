using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class BaseEntity
{
    public int Id {get; set;}
    public int Status {get; set;} = 1;
    public DateTime DateAdded {get; set;} = DateTime.UtcNow;
    public DateTime DateUpdated {get; set;} = DateTime.UtcNow;
}