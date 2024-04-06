using AutoMapper;
using TestLEM.Entities;
using TestLEM.Models;

namespace TestLEM.Mappers
{
    public class TestLEMMappingProfile : Profile
    {
        public TestLEMMappingProfile()
        {
            CreateMap<AddDeviceDto, Model>()
                .ForMember(x => x.Name, y => y.MapFrom(x => x.ModelName))
                .ForMember(x => x.SerialNumber, y => y.MapFrom(x => x.ModelSerialNumber));

            CreateMap<AddDeviceDto, Device>()
                .ForMember(x => x.Model, y => y.MapFrom(x => new Model
                {
                    Name = x.ModelName,
                    SerialNumber = x.ModelSerialNumber,
                    Company = new Company
                    {
                        Name = x.Company
                    }
                }));

            CreateMap<AddDeviceDto, Company>()
                .ForMember(x => x.Name, y => y.MapFrom(x => x.Company));
        }
    }
}
