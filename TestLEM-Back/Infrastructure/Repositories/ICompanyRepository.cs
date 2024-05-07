namespace Infrastructure.Repositories
{
    public interface ICompanyRepository
    {
        bool ChcekIfComapnyAlreadyExistsInDatabase(string comapnyName);
    }
}
