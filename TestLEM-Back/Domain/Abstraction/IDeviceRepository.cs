using Domain.Entities;

namespace Domain.Abstraction
{
    public interface IDeviceRepository
    {
        Task<int> AddDevice(Device device, CancellationToken cancellationToken = default);
        Task<bool> CheckIfDeviceExists(string identificationNumber, CancellationToken cancellationToken = default);
    }
}
