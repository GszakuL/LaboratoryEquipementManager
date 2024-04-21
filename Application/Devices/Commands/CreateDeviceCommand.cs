using Application.Abstractions.Messaging;
using Application.Models;

namespace Application.Devices.Commands;

public class CreateDeviceCommand(AddDeviceDto addDeviceDto) : ICommand<string>
{
    public AddDeviceDto AddDeviceDto { get; set; }
}

