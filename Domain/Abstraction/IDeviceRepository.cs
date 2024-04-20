using Domain.Entities;

namespace Domain.Abstraction
{
    public interface IDeviceRepository
    {
        Task AddDevice(Device device, CancellationToken cancellationToken = default);
    }
}
