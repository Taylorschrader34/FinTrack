using Bogus;
using FinTrack.Data;
using FinTrack.Models;
using Microsoft.EntityFrameworkCore;

namespace FinTrack.Helpers;

public class FakeDataGenerator
{
    public static List<Category> GenerateCategories(int count)
    {
        var faker = new Faker<Category>()
            .RuleFor(c => c.Id, f => f.UniqueIndex + 100)
            .RuleFor(c => c.Name, f => f.Commerce.Categories(1).FirstOrDefault())
            .RuleFor(c => c.Description, f => f.Lorem.Sentence());

        var fakedResults = faker.Generate(count);
        var filteredFakedResults = fakedResults
            .GroupBy(c => c.Name)
            .Select(g => g.First())
            .ToList();

        return filteredFakedResults;
    }

    public static List<Source> GenerateSources(int count)
    {
        var faker = new Faker<Source>()
            .RuleFor(s => s.Id, f => f.UniqueIndex + 100)
            .RuleFor(s => s.Name, f => f.Company.CompanyName())
            .RuleFor(s => s.Description, f => f.Lorem.Sentence());

        var fakedResults = faker.Generate(count);
        var filteredFakedResults = fakedResults
            .GroupBy(s => s.Name)
            .Select(g => g.First())
            .ToList();

        return filteredFakedResults;
    }

    public static List<Tag> GenerateTags(int count)
    {
        var faker = new Faker<Tag>()
            .RuleFor(t => t.Id, f => f.UniqueIndex + 100)
            .RuleFor(t => t.Name, f => f.Address.State())
            .RuleFor(t => t.Description, f => f.Lorem.Sentence());

        var fakedResults = faker.Generate(count);
        var filteredFakedResults = fakedResults
            .GroupBy(t => t.Name)
            .Select(g => g.First())
            .ToList();

        return filteredFakedResults;
    }

    public static List<Transaction> GenerateTransactions(int count, List<Category> categories, List<Source> sources, List<Tag> tags)
    {
        var faker = new Faker<Transaction>()
            .RuleFor(t => t.Id, f => f.UniqueIndex + 100)
            .RuleFor(t => t.TransactionDate, f => f.Date.Past())
            .RuleFor(t => t.SourceId, f => f.PickRandom(sources).Id)
            .RuleFor(t => t.CategoryId, f => f.PickRandom(categories).Id)
            .RuleFor(t => t.Amount, f => double.Parse(f.Commerce.Price(-1000, 1000, 2)))
            .RuleFor(t => t.Description, f => f.Lorem.Sentence())
            .RuleFor(t => t.Source, (f, t) => f.PickRandom(sources))
            .RuleFor(t => t.Category, (f, t) => f.PickRandom(categories))
            .RuleFor(t => t.Refunds, (f, t) =>
            {
                var numRefunds = f.Random.Int(0, 3);
                var refundFaker = new Faker<Refund>()
                    .RuleFor(r => r.Id, f => f.UniqueIndex + 200)
                    .RuleFor(r => r.TransactionId, f => t.Id)
                    .RuleFor(r => r.Amount, f => double.Parse(f.Commerce.Price(0, (int)Math.Abs(Math.Floor(t.Amount)), 2)))
                    .RuleFor(r => r.RefundDate, f => f.Date.Past())
                    .RuleFor(r => r.Description, f => f.Lorem.Sentence());
                return refundFaker.Generate(numRefunds);
            })
            .RuleFor(t => t.TransactionTags, (f, t) =>
            {
                var numTags = f.Random.Int(0, 3);
                var tagIds = f.PickRandom(tags, numTags).Select(tag => tag.Id).ToList();
                var transactionTags = tagIds.Select(tagId => new TransactionTag { TransactionId = t.Id, TagId = tagId }).ToList();
                return transactionTags;
            });

        return faker.Generate(count);
    }

    public static void GenerateFakeData(ApiDbContext dbContext, int categoryCount, int sourceCount, int tagCount, int transactionCount)
    {
        // Generate categories
        var categories = GenerateCategories(categoryCount);

        // Generate sources
        var sources = GenerateSources(sourceCount);

        // Generate tags
        var tags = GenerateTags(tagCount);

        // Generate transactions
        var transactions = GenerateTransactions(transactionCount, categories, sources, tags);

        dbContext.Category.AddRange(categories);
        dbContext.Source.AddRange(sources);
        dbContext.Tags.AddRange(tags);
        dbContext.Transaction.AddRange(transactions);
    }
}
