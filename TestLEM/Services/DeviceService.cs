using AutoMapper;
using TestLEM.Entities;
using TestLEM.Models;
using TestLEM.Repositories;

namespace TestLEM.Services
{
    public class DeviceService : IDeviceService
    {
        private readonly IDeviceRepository deviceRepository;
        private readonly ICompanyRepository companyRepository;
        private readonly IModelRepository modelRepository;
        private readonly IMapper mapper;

        public DeviceService(IDeviceRepository deviceRepository, ICompanyRepository companyRepository, IModelRepository modelRepository, IMapper mapper)
        {
            this.deviceRepository = deviceRepository;
            this.companyRepository = companyRepository;
            this.modelRepository = modelRepository;
            this.mapper = mapper;
        }

        public void AddDeviceToDatabase(AddDeviceDto addDeviceDto)
        {
            var deviceExists = deviceRepository.ChcekIfDeviceAlreadyExistsInDatabase(addDeviceDto.IdentifiactionNumber);
            if (deviceExists)
            {
                return;
            }
            var device = mapper.Map<Device>(addDeviceDto);

            var model = device.Model;
            var comapny = model.Company;

            var modelExists = modelRepository.ChcekIfModelAlreadyExistsInDatabase(model.Name, model.SerialNumber);
            if (modelExists)
            {
                var modelId = modelRepository.GetModelId(model.Name);
                device.Model = null;
                device.ModelId = modelId;
            }

            //var model = mapper.Map<Model>(addDeviceDto);
            //var company = mapper.Map<Company>(addDeviceDto);

            // tutaj pytanie czy powinienem sprawdzać wszystkie pozostałe powiązane wartości czy istnieją? jak to zrobić
            // przez serwisy? w sensie robię serwisy dla każdej encji i wstrzykuję je do tego serwisu i przez ich funkcje sprawdzam
            // czy istnieją? czy mam tworzyć przez automapper każdą z encji i dodawać ją tudaj do device, model etc?

            deviceRepository.AddDeviceToDatabase(device);
        }
    }
}
