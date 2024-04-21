using Domain.Entities;

namespace Domain.Abstraction
{
    public interface IModelRepository
    {
        Task<bool> ChcekIfModelExists(string name, string serialNumber);
        int GetModelId(string modelName);
        Task AddModel(Model model, CancellationToken cancellationToken = default);
    }
}
