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

        public async Task<int> AddDevice(Device device, CancellationToken cancellationToken)
        {
            _dbContext.Devices.Add(device);

            await _dbContext.SaveChangesAsync(cancellationToken);
            return device.Id;
        }

        public async Task<bool> CheckIfDeviceExists(string identificationNumber, CancellationToken cancellationToken)
        {
            var result = await _dbContext.Devices.AnyAsync(x => x.IdentificationNumber == identificationNumber, cancellationToken);
            return result;
        }

        public async Task<Device> GetDeviceById(int id, CancellationToken cancellationToken) => await _dbContext.Devices.FirstAsync(x => x.Id == id, cancellationToken);

        public async Task UpdateDeviceAsync(int deviceId, Device newDevice, CancellationToken cancellationToken)
        {
            var device = await GetDeviceById(deviceId, cancellationToken);
            _dbContext.Devices.Entry(device).CurrentValues.SetValues(newDevice);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
