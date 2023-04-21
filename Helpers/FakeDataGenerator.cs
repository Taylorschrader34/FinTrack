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
            .RuleFor(c => c.Id, f => f.UniqueIndex+100)
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
            .RuleFor(s => s.Id, f => f.UniqueIndex+100)
            .RuleFor(s => s.Name, f => f.Company.CompanyName())
            .RuleFor(s => s.Description, f => f.Lorem.Sentence());
        
        var fakedResults = faker.Generate(count);
        var filteredFakedResults = fakedResults
            .GroupBy(s => s.Name)
            .Select(g => g.First())
            .ToList();

        return filteredFakedResults;
    }

    public static List<Transaction> GenerateTransactions(int count, List<Category> categories, List<Source> sources)
    {
        var faker = new Faker<Transaction>()
            .RuleFor(t => t.Id, f => f.UniqueIndex+100)
            .RuleFor(t => t.TransactionDate, f => f.Date.Past())
            .RuleFor(t => t.SourceId, f => f.PickRandom(sources).Id)
            .RuleFor(t => t.CategoryId, f => f.PickRandom(categories).Id)
            .RuleFor(t => t.Amount, f => double.Parse(f.Commerce.Price()))
            .RuleFor(t => t.Description, f => f.Lorem.Sentence())
            .RuleFor(t => t.Source, (f, t) => f.PickRandom(sources))
            .RuleFor(t => t.Category, (f, t) => f.PickRandom(categories));

        return faker.Generate(count);
    }

    public static void GenerateFakeData(ApiDbContext dbContext, int categoryCount, int sourceCount, int transactionCount)
    {
        // Generate categories
        var categories = GenerateCategories(categoryCount);

        // Generate sources
        var sources = GenerateSources(sourceCount);

        // Generate transactions
        var transactions = GenerateTransactions(transactionCount, categories, sources);

        dbContext.Category.AddRange(categories);
        dbContext.Source.AddRange(sources);
        dbContext.Transaction.AddRange(transactions);
    }
}
