using Application.Abstractions;
using Application.Models;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Devices.Queries
{
    internal class GetAllDevicesQueryHandler :
        IRequestHandler<GetAllDevicesQuery, PagedList<GetDeviceDto>>
    {
        private readonly IApplicationDbContext _dbContext;

        public GetAllDevicesQueryHandler(IApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedList<GetDeviceDto>> Handle(GetAllDevicesQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Device> devicesQuery = _dbContext.Devices;
            IQueryable<MeasuredValue> measuredValueQuery = _dbContext.MeasuredValues;
            var searchTerm = request.SearchTerm?.ToLower();
            const string descWord = "desc";

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                devicesQuery = devicesQuery
                    .Include(x => x.Model)
                        .ThenInclude(x => x.MeasuredValues)
                            .ThenInclude(x => x.PhysicalMagnitude)
                    .Where(x => x.Model.Name.ToLower().Contains(searchTerm)
                             || x.Model.MeasuredValues.Where(x => x.PhysicalMagnitude.Name.ToLower().Contains(searchTerm)).Any());

            }

            if (request.SortOrder?.ToLower() == descWord)
            {
                devicesQuery = devicesQuery.OrderByDescending(x => x.Model.Name);
                measuredValueQuery = measuredValueQuery.OrderByDescending(x => x.Model.Name);
            }
            else
            {
                devicesQuery = devicesQuery.OrderBy(x => x.Model.Name);
                measuredValueQuery = measuredValueQuery.OrderBy(x => x.Model.Name);
            }

            var deviceQueryResponse = devicesQuery
                .Select(x => new GetDeviceDto
                {
                    DeviceIdentificationNumber = x.IdentifiactionNumber,
                    ModelName = x.Model.Name,
                    ModelSerialNumber = x.Model.SerialNumber,
                    StorageLocation = x.StorageLocation,
                    MeasuredValues = (ICollection<MeasuredValueDto>)x.Model.MeasuredValues.Select(y =>
                        new MeasuredValueDto
                        {
                            PhysicalMagnitudeName = y.PhysicalMagnitude.Name,
                            PhysicalMagnitudeUnit = y.PhysicalMagnitude.Unit
                        })
                });

            var devices = await PagedList<GetDeviceDto>.CreateAsync(deviceQueryResponse, request.Page, request.PageSize);

            return devices;
        }
    }
}
