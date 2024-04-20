using Domain.Abstraction;
using Domain.Entities;

namespace Infrastructure.Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private readonly LemDbContext _dbContext;

        public DeviceRepository(LemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //jak ugryźć error przy dodawaniu? dać tu taska i asynca?
        public async Task AddDevice(Device device, CancellationToken cancellationToken)
        {
            _dbContext.Devices.Add(device);

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
