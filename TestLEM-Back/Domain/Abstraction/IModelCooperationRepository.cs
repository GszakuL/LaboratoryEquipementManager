namespace Domain.Abstraction
{
    public interface IModelCooperationRepository
    {
        Task AddModelCooperation(int deviceId, ICollection<int> cooperatedDevicesIds);
    }
}
