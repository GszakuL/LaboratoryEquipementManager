using Application.Abstractions.Messaging;
using Application.Models;

namespace Application.Devices.Commands;

public class CreateDeviceCommand(AddDeviceDto addDeviceDto) : ICommand<int>
{
    public AddDeviceDto AddDeviceDto { get; set; } = addDeviceDto;
}

