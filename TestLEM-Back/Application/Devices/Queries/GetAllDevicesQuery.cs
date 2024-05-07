using Application.Models;
using MediatR;

namespace Application.Devices.Queries
{
    public record GetAllDevicesQuery(string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize) : IRequest<PagedList<GetDeviceDto>>;
}
