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
        private readonly IModelCooperationRepository _modelCooperationRepository;
        private readonly IMapper _mapper;
        private readonly ISender _sender;

        public CreateModelCommandHandler(IModelRepository modelRepository, IModelCooperationRepository modelCooperationRepository,
                                         IMapper mapper, ISender sender)
        {
            _modelRepository = modelRepository;
            _modelCooperationRepository = modelCooperationRepository;
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

            //ogarnięcie firmy

            var model = _mapper.Map<Model>(request.ModelDto);

            if (request.ModelDto.MeasuredValues != null)
            {
                var measuredValues = GetMeasuredValuesForModel(request.ModelDto.MeasuredValues);
                model.MeasuredValues = measuredValues;
            }

            await _modelRepository.AddModel(model);

            var documents = request.ModelDto.Documents;
            if (documents != null)
            {
                var documentsNames = await _sender.Send(
                    new AddDocumentsCommand(documents, model.Id, null),
                    cancellationToken);
            }

            var cooperatedModelsIds = request.ModelDto.CooperatedModelsIds;
            if (cooperatedModelsIds != null)
            {
                await _modelCooperationRepository.AddModelCooperation(model.Id, cooperatedModelsIds);
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
                    }
                };

                if (measuredValueDto.MeasuredRanges != null)
                {
                    measuredValue.MeasuredRanges = GetMeasuredRanges(measuredValueDto.MeasuredRanges);
                }
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
