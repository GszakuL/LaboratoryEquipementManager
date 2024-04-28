using Domain.Abstraction;
using Domain.Entities;

namespace Infrastructure.Repositories
{
    public class ModelCooperationRepository : IModelCooperationRepository
    {
        private readonly LemDbContext _dbContext;

        public ModelCooperationRepository(LemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddModelCooperation(int modelId, ICollection<int> cooperatedDevicesIds)
        {
            var cooperations = new List<ModelCooperation>();
            foreach(var cooperatedDeviceId in cooperatedDevicesIds)
            {
                var cooperation = new ModelCooperation() 
                {
                    ModelFromId = modelId,
                    ModelToId = cooperatedDeviceId,
                };
                cooperations.Add(cooperation);
            };
            await _dbContext.AddRangeAsync(cooperations);
            await _dbContext.SaveChangesAsync();
        }
    }
}
