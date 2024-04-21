using Application.Abstractions.Messaging;
using Application.Models.Commands;
using AutoMapper;
using Domain.Abstraction;
using Domain.Entities;
using Domain.Exceptions;
using MediatR;

namespace Application.Devices.Commands
{
    internal class CreateDeviceCommandHandler : ICommandHandler<CreateDeviceCommand, string>
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IModelRepository _modelRepository;
        private readonly IMapper _mapper;
        private readonly ISender _sender;

        public CreateDeviceCommandHandler(IDeviceRepository deviceRepository, IModelRepository modelRepository, IMapper mapper, ISender sender)
        {
            _deviceRepository = deviceRepository;
            _modelRepository = modelRepository;
            _mapper = mapper;
            _sender = sender;
        }

        public async Task<string> Handle(CreateDeviceCommand request, CancellationToken cancellationToken)
        {
            var identificationNumber = request.AddDeviceDto.IdentifiactionNumber;
            var deviceExists = await _deviceRepository.CheckIfDeviceExists(identificationNumber);

            if (deviceExists)
            {
                throw new DeviceAlreadyExistsException(identificationNumber);
            }
            var device = _mapper.Map<Device>(request.AddDeviceDto);

            var model = request.AddDeviceDto.Model;

            var modelId = await _sender.Send(
                new CreateModelCommand(model),
                cancellationToken);

            device.ModelId = modelId;

            await _deviceRepository.AddDevice(device);

            return identificationNumber;
        }
    }
}
