using Application.Abstractions.Messaging;
using Application.Documents;
using Application.Models.Commands;
using AutoMapper;
using Domain.Abstraction;
using Domain.Entities;
using Domain.Exceptions.Devices;
using MediatR;

namespace Application.Devices.Commands
{
    internal class CreateDeviceCommandHandler : ICommandHandler<CreateDeviceCommand, string>
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IMapper _mapper;
        private readonly ISender _sender;

        public CreateDeviceCommandHandler(IDeviceRepository deviceRepository, IMapper mapper, ISender sender)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
            _sender = sender;
        }

        public async Task<string> Handle(CreateDeviceCommand request, CancellationToken cancellationToken)
        {
            var identificationNumber = request.AddDeviceDto.IdentifiactionNumber;
            var deviceExists = await _deviceRepository.CheckIfDeviceExists(identificationNumber, cancellationToken);

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

            var documents = request.AddDeviceDto.Documents;
            if (documents.Any())
            {
                var documentsNames = await _sender.Send(
                    new AddDocumentsCommand(documents, null, device.Id),
                    cancellationToken);
            }

            return identificationNumber;
        }
    }
}
