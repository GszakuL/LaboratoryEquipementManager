using Application.Abstractions;
using Domain.Abstraction;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly IApplicationDbContext _dbContext;

        public DeviceRepository(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddDevice(Device device, CancellationToken cancellationToken)
        {
            _dbContext.Devices.Add(device);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> CheckIfDeviceExists(string identificationNumber, CancellationToken cancellationToken)
        {
            var result = await _dbContext.Devices.AnyAsync(x => x.IdentifiactionNumber == identificationNumber, cancellationToken);
            return result;
        }
    }
}
