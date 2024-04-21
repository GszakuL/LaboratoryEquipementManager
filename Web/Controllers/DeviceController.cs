using Application.Devices.Commands;
using Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/devices")]
    public class DeviceController : ApiController
    {
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddDevice(AddDeviceDto addDeviceDto, CancellationToken cancellationToken)
        { 
            var command = new CreateDeviceCommand(addDeviceDto);

            var deviceIdentificationNumber = await Sender.Send(command, cancellationToken);
            
            return Ok(deviceIdentificationNumber);
        }
    }
}
