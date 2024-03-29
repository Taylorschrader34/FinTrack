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
    public DbSet<Refund> Refunds { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<TransactionTag> TransactionTags { get; set; }

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

            entity.HasMany(i => i.Refunds)
            .WithOne(r => r.Transaction)
            .HasForeignKey(r => r.TransactionId);
        });

        modelBuilder.Entity<TransactionTag>(entity =>
        {
            entity.HasKey(tt => new { tt.TransactionId, tt.TagId });

            entity.HasOne(tt => tt.Transaction)
            .WithMany(t => t.TransactionTags)
            .HasForeignKey(tt => tt.TransactionId);

            entity.HasOne(tt => tt.Tag)
            .WithMany(t => t.TransactionTags)
            .HasForeignKey(tt => tt.TagId);
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