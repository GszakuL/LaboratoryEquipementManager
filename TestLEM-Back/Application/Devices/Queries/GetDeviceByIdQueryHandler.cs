using Application.Abstractions;
using Application.Helpers;
using Application.Models;
using Domain.Entities;
using Domain.Exceptions.Devices;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Devices.Queries
{
    internal class GetDeviceByIdQueryHandler : IRequestHandler<GetDeviceByIdQuery, DeviceDetailsDto>
    {
        private readonly IApplicationDbContext _dbContext;

        public GetDeviceByIdQueryHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DeviceDetailsDto> Handle(GetDeviceByIdQuery request, CancellationToken cancellationToken)
        {
            var device = await _dbContext.Devices
                .Include(x => x.Model)
                    .ThenInclude(x => x.Company)
                .FirstAsync(x => x.Id == request.deviceId);

            if (device == null)
            {
                throw new DeviceNotFoundException(request.deviceId);
            }

            var deviceDetailsDto = new DeviceDetailsDto
            {
                Id = device.Id,
                ModelName = device.Model.Name,
                DeviceIdentificationNumber = device.IdentificationNumber,
                MeasuredValues = GetMeasuredValues(device.ModelId),
                ModelSerialNumber = device.Model.SerialNumber,
                StorageLocation = device.StorageLocation,
                ProductionDate = device.ProductionDate,
                LastCalibrationDate = device.LastCalibrationDate,
                Producer = device.Model.Company?.Name,
                CalibrationPeriodInYears = device.CalibrationPeriodInYears,
                IsCalibrated = CheckIfDeviceIsCalibrated(device?.LastCalibrationDate, device?.CalibrationPeriodInYears),
                DeviceDocuments = GetDocumentsForDevice(device.Id),
                ModelDocuments = GetDocumentsForModel(device.ModelId),
                RelatedModels = GetRelatedModels(device.ModelId),
            };

            return deviceDetailsDto;
        }

        private bool? CheckIfDeviceIsCalibrated(DateTime? lasCalibrationDate, int? calibrationPeriodInYears) // do oddzielnego helpera
        {
            if (!lasCalibrationDate.HasValue || !calibrationPeriodInYears.HasValue)
            {
                return null;
            }

            return lasCalibrationDate.Value.AddYears(calibrationPeriodInYears.Value) > DateTime.Now;
        }

        private ICollection<DocumentDto>? GetDocumentsForDevice(int deviceId)
        {
            var deviceDocuments = _dbContext.Documents.Where(x => x.DeviceId == deviceId).ToList();
            if (!deviceDocuments.Any())
            {
                return null;
            }

            return GetDocumentsDto(deviceDocuments);

        }
        private ICollection<DocumentDto>? GetDocumentsForModel(int modelId)
        {
            var modelDocuments = _dbContext.Documents.Where(x => x.ModelId == modelId).ToList();
            if (!modelDocuments.Any())
            {
                return null;
            }

            return GetDocumentsDto(modelDocuments);
        }

        private List<DocumentDto> GetDocumentsDto(ICollection<Document> documents)
        {
            var result = new List<DocumentDto>();
            foreach (var document in documents)
            {
                var documentDto = new DocumentDto
                {
                    Name = document.Name,
                    Format = document.Format,
                };
                result.Add(documentDto);
            }

            return result;
        }

        private List<ModelDto> GetRelatedModels(int modelId)
        {
            var relatedModels = _dbContext.ModelCooperation.Where(x => x.ModelFromId == modelId)
                .Select(y => new ModelDto
                {
                    Name = y.ModelTo.Name,
                    SerialNumber = y.ModelTo.SerialNumber,
                }).ToList();

            return relatedModels;                                  
        }

        private List<MeasuredValueDto> GetMeasuredValues(int modelId)
        {
            var measuredValues = _dbContext.MeasuredValues
                .Where(x => x.ModelId == modelId)
                .Select(x => new MeasuredValueDto
                {
                    PhysicalMagnitudeName = x.PhysicalMagnitude.Name,
                    PhysicalMagnitudeUnit = x.PhysicalMagnitude.Unit,
                    MeasuredRanges = (ICollection<MeasuredRangesDto>)x.MeasuredRanges.Select(y => new MeasuredRangesDto
                    {
                        Range = y.Range,
                        AccuracyInPercent = y.AccuracyInPercet
                    })
                }).ToList();

            return measuredValues;
        }
    }
}
