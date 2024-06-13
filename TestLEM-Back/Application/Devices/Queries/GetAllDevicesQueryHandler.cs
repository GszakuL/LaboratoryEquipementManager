using Application.Abstractions;
using Application.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Devices.Queries
{
    internal class GetAllDevicesQueryHandler :
        IRequestHandler<GetAllDevicesQuery, PagedList<DeviceDto>>
    {
        private readonly IApplicationDbContext _dbContext;

        public GetAllDevicesQueryHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedList<DeviceDto>> Handle(GetAllDevicesQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Device> devicesQuery = _dbContext.Devices;
            var searchTerm = request.pagedAndSortedDevicesQueryDto.SearchTerm?.ToLower();
            const string descWord = "desc";

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                devicesQuery = devicesQuery
                    .Include(x => x.Model)
                        .ThenInclude(x => x.MeasuredValues)
                            .ThenInclude(x => x.PhysicalMagnitude)
                    .Where(x => x.Model.Name.ToLower().Contains(searchTerm)
                             || x.Model.MeasuredValues.Where(x => x.PhysicalMagnitude.Name.ToLower().Contains(searchTerm)).Any()
                             || x.IdentificationNumber == searchTerm);

            }
            //do refaktoru
            if (request.pagedAndSortedDevicesQueryDto.SortOrder?.ToLower() == descWord)
            {
                if (request.pagedAndSortedDevicesQueryDto.SortColumn == "modelName")
                {
                    devicesQuery = devicesQuery.OrderByDescending(x => x.Model.Name);
                }
                else
                {
                    devicesQuery = devicesQuery.OrderByDescending(x => x.NextCalibrationDate.HasValue)
                                               .ThenByDescending(x => x.NextCalibrationDate);
                }
            }
            else
            {
                if (request.pagedAndSortedDevicesQueryDto.SortColumn == "modelName")
                {
                    devicesQuery = devicesQuery.OrderBy(x => x.Model.Name);
                }
                else
                {
                    devicesQuery = devicesQuery.OrderBy(x => x.NextCalibrationDate.HasValue)
                                               .ThenBy(x => x.NextCalibrationDate);
                }
            }

            var deviceQueryResponse = devicesQuery
                .Select(x => new DeviceDto
                {
                    Id = x.Id,
                    DeviceIdentificationNumber = x.IdentificationNumber,
                    ModelName = x.Model.Name,
                    ModelSerialNumber = x.Model.SerialNumber,
                    StorageLocation = x.StorageLocation,
                    LastCalibrationDate = x.LastCalibrationDate,
                    ProductionDate = x.ProductionDate,
                    CalibrationPeriodInYears = x.CalibrationPeriodInYears,
                    MeasuredValues = (ICollection<MeasuredValueDto>)x.Model.MeasuredValues.Select(y =>
                        new MeasuredValueDto
                        {
                            PhysicalMagnitudeName = y.PhysicalMagnitude.Name,
                            PhysicalMagnitudeUnit = y.PhysicalMagnitude.Unit
                        })
                });

            var devices = await PagedList<DeviceDto>.CreateAsync(deviceQueryResponse, request.pagedAndSortedDevicesQueryDto.Page, request.pagedAndSortedDevicesQueryDto.PageSize);

            return devices;
        }
    }
}
