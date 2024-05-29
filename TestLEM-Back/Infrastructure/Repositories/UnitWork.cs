using Application.Abstractions;
using Domain.Abstraction;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;

namespace Infrastructure.Repositories
{
    public class UnitWork : IUnitOfWork
    {
        private readonly IApplicationDbContext _dbContext;

        public UnitWork(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IDbTransaction BeginTransaction()
        {
            var transaction = _dbContext.Database.BeginTransaction();
            return transaction.GetDbTransaction();
        }
    }
}
