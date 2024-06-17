using Domain.Abstraction;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ModelRepository : IModelRepository
    {
        private readonly LemDbContext _dbContext;

        public ModelRepository(LemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> ChcekIfModelExists(string name, string serialNumber) =>  await _dbContext.Models.AnyAsync(x => x.SerialNumber == serialNumber || x.Name == name); //trzeba jakoś ograć co w przypadku gdy użtkownik poda nieistenijący serial, a istenijącą nazwę
        public int GetModelId(string name, string serialNumber) => _dbContext.Models.First(x =>x.SerialNumber == serialNumber || x.Name == name).Id;


        public async Task AddModel(Model model, CancellationToken cancellationToken)
        {
            _dbContext.Models.Add(model);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<Model> GetModelById(int modelId, CancellationToken cancellationToken)
        {
            return await _dbContext.Models.Include(x => x.MeasuredValues).ThenInclude(x => x.PhysicalMagnitude).ThenInclude(x => x.MeasuredValues).ThenInclude(x => x.MeasuredRanges).FirstAsync(x => x.Id == modelId, cancellationToken);
        }

        public async Task<ICollection<Model>> GetModelsByName(string name, CancellationToken cancellationToken)
        {
            var models = await _dbContext.Models.Where(x => x.Name.ToLower() == name.ToLower()).ToListAsync(cancellationToken);
            return models;
        }
    }
}
