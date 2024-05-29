using System.Data;

namespace Domain.Abstraction
{
    public interface IUnitOfWork
    {
        IDbTransaction BeginTransaction();
    }
}
