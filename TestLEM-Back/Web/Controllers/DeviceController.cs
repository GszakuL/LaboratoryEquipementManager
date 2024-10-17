using Application.Devices.Commands;
using Application.Devices.Queries;
using Application.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/device")]
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
        public async Task<IActionResult> AddDevice([FromBody] AddDeviceDto addDeviceDto, [FromForm] IFormFileCollection documents, CancellationToken cancellationToken)
        {
            var command = new CreateDeviceCommand(addDeviceDto);

            var deviceIdentificationNumber = await _mediator.Send(command, cancellationToken);
            return Ok(deviceIdentificationNumber);
        }

        [HttpPost("sorted")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetDevices([FromBody] PagedAndSortedDevicesListQueryDto pagedAndSortedDevicesQuery, CancellationToken cancellationToken)
        {
            var query = new GetAllDevicesQuery(pagedAndSortedDevicesQuery);

            var pagedAndSortedDevicesList = await _mediator.Send(query, cancellationToken);
            return Ok(pagedAndSortedDevicesList);
        }

        [HttpGet("{deviceId}")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetDeviceDetails([FromRoute] int deviceId, CancellationToken cancellationToken)
        {
            var query = new GetDeviceByIdQuery(deviceId);

            var deviceDetails = await _mediator.Send(query, cancellationToken);
            return Ok(deviceDetails);
        }

        [HttpPut("{deviceId}/edit")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditDevice([FromRoute] int deviceId, [FromBody] EditDeviceRequestDto editDeviceDto, CancellationToken cancellationToken)
        {
            var query = new EditDeviceCommand(deviceId, editDeviceDto.OldDevice, editDeviceDto.NewDevice, editDeviceDto.ModelCooperationsToBeRemoved, cancellationToken);

            var editionResult = await _mediator.Send(query, cancellationToken);
            return Ok(editionResult);
        }

        [HttpDelete("{deviceId}/remove")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveDevice([FromRoute] int deviceId, CancellationToken cancellationToken)
        {
            var query = new RemoveDeviceCommand(deviceId, cancellationToken);

            var editionResult = await _mediator.Send(query, cancellationToken);
            return Ok(editionResult);
        }
    }
}
