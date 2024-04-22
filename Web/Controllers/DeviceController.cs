using Application.Devices.Commands;
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
    }
}
