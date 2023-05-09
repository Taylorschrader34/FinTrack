using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id {get; set;}
    public int Status {get; set;} = 1;
    public DateTime DateAdded {get; set;} = DateTime.UtcNow;
    public DateTime DateUpdated {get; set;} = DateTime.UtcNow;
}