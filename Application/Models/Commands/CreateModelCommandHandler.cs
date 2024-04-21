using Application.Abstractions.Messaging;
using AutoMapper;
using Domain.Abstraction;
using Domain.Entities;

namespace Application.Models.Commands
{
    internal class CreateModelCommandHandler : ICommandHandler<CreateModelCommand, int>
    {
        private readonly IModelRepository _modelRepository;
        private readonly IMapper _mapper;

        public CreateModelCommandHandler(IModelRepository modelRepository, IMapper mapper)
        {
            _modelRepository = modelRepository;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateModelCommand request, CancellationToken cancellationToken)
        {
            var modelExists = await _modelRepository.ChcekIfModelExists(request.ModelDto.Name, request.ModelDto.SerialNumber);
            if (modelExists)
            {
                return _modelRepository.GetModelId(request.ModelDto.Name);
            }

            var model = _mapper.Map<Model>(request.ModelDto);

            await _modelRepository.AddModel(model);

            //mediator.send(AddMeasuredValues)
            //mediator.send(AddCompany)

            return model.Id;
        }
    }
}
