using Application.Abstractions.Messaging;
using Application.Models;
using Application.Models.Commands;
using AutoMapper;
using Domain.Abstraction;
using Domain.Entities;
using MediatR;

namespace Application.Devices.Commands
{
    internal class EditDeviceCommandHandler : ICommandHandler<EditDeviceCommand, bool>
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IMapper _mapper;
        private readonly ISender _sender;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IModelRepository _modelRepository;

        public EditDeviceCommandHandler(IDeviceRepository deviceRepository, IMapper mapper, ISender sender, IUnitOfWork unitOfWork, IModelRepository modelRepository)
        {
            _deviceRepository = deviceRepository;
            _mapper = mapper;
            _sender = sender;
            _unitOfWork = unitOfWork;
            _modelRepository = modelRepository;
        }

        public async Task<bool> Handle(EditDeviceCommand request, CancellationToken cancellationToken)
        {
            var device = await _deviceRepository.GetDeviceById(request.deviceId, cancellationToken);

            var oldValues = request.oldDeviceDto;
            var newValues = request.newDeviceDto;

            if (oldValues.IdentificationNumber != newValues.IdentificationNumber)
            {
                device.IdentificationNumber = newValues.IdentificationNumber;
            }
            if (oldValues.ProductionDate != newValues.ProductionDate)
            {
                device.ProductionDate = newValues.ProductionDate;
            }
            if (oldValues.CalibrationPeriodInYears != newValues.CalibrationPeriodInYears)
            {
                device.CalibrationPeriodInYears = newValues.CalibrationPeriodInYears;
            }
            if (oldValues.LastCalibrationDate != newValues.LastCalibrationDate)
            {
                device.LastCalibrationDate = newValues.LastCalibrationDate;
            }
            if (oldValues.NextCalibrationDate != newValues.NextCalibrationDate)
            {
                device.NextCalibrationDate = newValues.NextCalibrationDate;
            }
            if (oldValues.IsCalibrated != newValues.IsCalibrated)
            {
                device.IsCalibrated = newValues.IsCalibrated;
            }
            if (oldValues.IsCalibrationCloseToExpire != newValues.IsCalibrationCloseToExpire)
            {
                device.IsCalibrationCloseToExpire = newValues.IsCalibrationCloseToExpire;
            }
            if (oldValues.StorageLocation != newValues.StorageLocation)
            {
                device.StorageLocation = newValues.StorageLocation;
            }

            using var transaction = _unitOfWork.BeginTransaction();

            try
            {
                if (oldValues.Model.Id != newValues.Model.Id)
                {
                    oldValues.Model.Id = await HandleModelEditionAsync(oldValues.Model, newValues.Model, request.modelCooperationsToBeRemoved);
                }

                var newMappedDevice = _mapper.Map<Device>(oldValues);
                await _deviceRepository.UpdateDeviceAsync(request.deviceId, newMappedDevice, cancellationToken);
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception(ex.Message);
            }
        }


        private async Task<int> HandleModelEditionAsync(ModelDto currentModel, ModelDto newModel, ICollection<int>? cooperationsToBeRemoved)
        {
            var modelExists = await _modelRepository.CheckIfModelExistsByIdAsync(newModel.Id);

            if (modelExists)
            {
                var modelDiffers = CheckIfModelValuesDiffer(currentModel, newModel);
                if (modelDiffers)
                {
                    return await _sender.Send(new EditModelCommand(currentModel.Id, newModel, cooperationsToBeRemoved));
                }
                else
                {
                    return newModel.Id;
                }

            }
            else
            {
                return await _sender.Send(new CreateModelCommand(newModel));
            }
        }


        private bool CheckIfModelValuesDiffer(ModelDto oldModel, ModelDto newModel)
        {
            var oldValue = oldModel.GetType();
            foreach(var property in oldValue.GetProperties())
            {
                var oldVal = property.GetValue(oldModel);
                var newVal = property.GetValue(newModel);

                if (oldVal != newVal)
                {
                    return false;
                }
            }
            return true;
        }
    }
}
