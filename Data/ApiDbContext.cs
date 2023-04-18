using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FinTrack.Models;

namespace FinTrack.Data;

public class ApiDbContext : DbContext
{
    public virtual DbSet<Category> Category { get; set; }
    public virtual DbSet<Source> Source { get; set; }
    public virtual DbSet<IncomeTransaction> IncomeTransaction { get; set; }
    public virtual DbSet<ExpenseTransaction> ExpenseTransaction { get; set; }

    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IncomeTransaction>(entity =>
        {
            entity.HasOne(i => i.Category)
            .WithMany(c => c.IncomeTransactions)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_IncomeTransaction_Category");

            entity.HasOne(i => i.Source)
            .WithMany(s => s.IncomeTransactions)
            .HasForeignKey(x => x.SourceId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_IncomeTransaction_Source");
        });

        modelBuilder.Entity<ExpenseTransaction>(entity =>
        {
            entity.HasOne(i => i.Category)
            .WithMany(c => c.ExpenseTransactions)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_ExpenseTransaction_Category");

            entity.HasOne(i => i.Source)
            .WithMany(s => s.ExpenseTransactions)
            .HasForeignKey(x => x.SourceId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_ExpenseTransaction_Source");
        });
    }
}