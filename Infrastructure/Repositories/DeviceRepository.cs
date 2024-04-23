using Domain.Abstraction;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly LemDbContext _dbContext;

        public DeviceRepository(LemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddDevice(Device device, CancellationToken cancellationToken)
        {
            _dbContext.Devices.Add(device);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> CheckIfDeviceExists(string identificationNumber, CancellationToken cancellationToken = default)
        {
            var result = await _dbContext.Devices.AnyAsync(x => x.IdentifiactionNumber == identificationNumber);
            return result;
        }
    }
}
