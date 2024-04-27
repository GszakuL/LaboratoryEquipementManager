using Application.Abstractions.Messaging;
using Application.Documents;
using AutoMapper;
using Domain.Abstraction;
using Domain.Entities;
using MediatR;

namespace Application.Models.Commands
{
    internal class CreateModelCommandHandler : ICommandHandler<CreateModelCommand, int>
    {
        private readonly IModelRepository _modelRepository;
        private readonly IMapper _mapper;
        private readonly ISender _sender;

        public CreateModelCommandHandler(IModelRepository modelRepository, IMapper mapper, ISender sender)
        {
            _modelRepository = modelRepository;
            _mapper = mapper;
            _sender = sender;
        }

        public async Task<int> Handle(CreateModelCommand request, CancellationToken cancellationToken)
        {
            var modelExists = await _modelRepository.ChcekIfModelExists(request.ModelDto.Name, request.ModelDto.SerialNumber);
            if (modelExists)
            {
                return _modelRepository.GetModelId(request.ModelDto.Name, request.ModelDto.SerialNumber);
            }

            var model = _mapper.Map<Model>(request.ModelDto);

            var measuredValues = GetMeasuredValuesForModel(request.ModelDto.MeasuredValues);

            model.MeasuredValues = measuredValues;

            await _modelRepository.AddModel(model);

            var documents = request.ModelDto.Documents;
            if (documents.Any())
            {
                var documentsNames = await _sender.Send(
                    new AddDocumentsCommand(documents, model.Id, null),
                    cancellationToken);
            }

            return model.Id;
        }

        private ICollection<MeasuredValue> GetMeasuredValuesForModel(ICollection<MeasuredValueDto> measuredValuesDtos)
        {
            var measuredValues = new List<MeasuredValue>();

            foreach (var measuredValueDto in measuredValuesDtos)
            {
                var measuredValue = new MeasuredValue
                {
                    PhysicalMagnitude = new PhysicalMagnitude
                    {
                        Name = measuredValueDto.PhysicalMagnitudeName,
                        Unit = measuredValueDto.PhysicalMagnitudeUnit
                    },
                    MeasuredRanges = GetMeasuredRanges(measuredValueDto.MeasuredRanges)
                };
                measuredValues.Add(measuredValue);
            }
            return measuredValues;
        }

        private ICollection<MeasuredRange> GetMeasuredRanges(ICollection<MeasuredRangesDto> measuredRangesDtos)
        {
            var measuredRanges = new List<MeasuredRange>();

            foreach (var measuredRangeDto in measuredRangesDtos)
            {
                var measuredRange = new MeasuredRange
                {
                    Range = measuredRangeDto.Range,
                    AccuracyInPercet = measuredRangeDto.AccuracyInPercent
                };
                measuredRanges.Add(measuredRange);
            }
            return measuredRanges;
        }
    }
}
