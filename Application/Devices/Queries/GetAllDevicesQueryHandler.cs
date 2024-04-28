using Application.Abstractions;
using Application.Models;
using Domain.Abstraction;
using Domain.Entities;
using MediatR;

namespace Application.Devices.Queries
{
    internal class GetAllDevicesQueryHandler :
        IRequestHandler<GetAllDevicesQuery, PagedList<GetDeviceDto>>
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IApplicationDbContext _dbContext;

        public GetAllDevicesQueryHandler(IDeviceRepository deviceRepository, IApplicationDbContext dbContext)
        {
            _deviceRepository = deviceRepository;
            _dbContext = dbContext;
        }

        public Task<PagedList<GetDeviceDto>> Handle(GetAllDevicesQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Device> devicesQuery = _dbContext.Devices;

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                devicesQuery = devicesQuery.Where(p =>
                    p.Name.Contains(request.SearchTerm) ||
                    ((string)p.Sku).Contains(request.SearchTerm));
            }
        }
    }
}
