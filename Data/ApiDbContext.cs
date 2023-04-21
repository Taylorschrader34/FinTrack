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
    public virtual DbSet<Transaction> Transaction { get; set; }

    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasOne(i => i.Category)
            .WithMany(c => c.Transactions)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Transaction_Category");

            entity.HasOne(i => i.Source)
            .WithMany(s => s.Transactions)
            .HasForeignKey(x => x.SourceId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_Transaction_Source");
        });

        modelBuilder.Entity<Source>(entity => 
        {
            entity.HasIndex(s => s.Name)
            .IsUnique();
        });

        modelBuilder.Entity<Category>(entity => 
        {
            entity.HasIndex(c => c.Name)
            .IsUnique();
        });
    }
}