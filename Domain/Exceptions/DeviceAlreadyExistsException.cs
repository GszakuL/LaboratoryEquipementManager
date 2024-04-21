using Domain.Exceptions.Base;
namespace Domain.Exceptions
{
    public sealed class DeviceAlreadyExistsException : AlreadyExistsException
    {
        public DeviceAlreadyExistsException(string identificationNumber)
            : base($"Device with identification number: {identificationNumber} already exists in database")
        { 
        }
    }
}
