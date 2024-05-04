using Application.Devices.Commands;
using Application.Devices.Queries;
using Application.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/devices")]
    public class DeviceController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeviceController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddDevice([FromBody]AddDeviceDto addDeviceDto, CancellationToken cancellationToken)
        { 
            var command = new CreateDeviceCommand(addDeviceDto);

            var deviceIdentificationNumber = await _mediator.Send(command, cancellationToken);
            return Ok(deviceIdentificationNumber);
        }

        [HttpGet]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetDevices(string? SearchTerm, string? SortColumn, string? SortOrder,
        int Page, int PageSize, CancellationToken cancellationToken)
        {
            var query = new GetAllDevicesQuery(SearchTerm, SortColumn, SortOrder, Page, PageSize);

            var pagedAndSortedDevicesList = await _mediator.Send(query, cancellationToken);
            return Ok(pagedAndSortedDevicesList);
        }
    }
}
