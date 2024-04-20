using Application.Abstractions.Messaging;
using AutoMapper;
using Domain.Abstraction;
using Domain.Entities;

namespace Application.Devices.Commands
{
    internal class CreateDeviceCommandHandler : ICommandHandler<CreateDeviceCommand, int>
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IMapper _mapper;

        public CreateDeviceCommandHandler(IDeviceRepository deviceRepository, IMapper mapper)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateDeviceCommand request, CancellationToken cancellationToken)
        {
            var device = _mapper.Map<Device>(request.AddDeviceDto);
            await _deviceRepository.AddDevice(device);

            return device.Id;
        }
    }
}
