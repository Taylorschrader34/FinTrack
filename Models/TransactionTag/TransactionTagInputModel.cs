using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinTrack.Models;

public class TransactionTagInputModel
    {
        public int TagId { get; set; }
        public int TransactionId { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }

