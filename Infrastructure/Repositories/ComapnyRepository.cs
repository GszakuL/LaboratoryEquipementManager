using Application.Abstractions;

namespace Infrastructure.Repositories
{
    public class ComapnyRepository : ICompanyRepository
    {
        private readonly IApplicationDbContext _dbContext;

        public ComapnyRepository(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public bool ChcekIfComapnyAlreadyExistsInDatabase(string comapnyName) => _dbContext.Companies.Any(x => x.Name == comapnyName);
    }
}
