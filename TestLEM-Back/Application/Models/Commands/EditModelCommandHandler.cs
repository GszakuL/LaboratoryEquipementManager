using Application.Abstractions.Messaging;
using AutoMapper;
using Domain.Abstraction;
using Domain.Entities;

namespace Application.Models.Commands
{
    internal class EditModelCommandHandler : ICommandHandler<EditModelCommand, int>
    {
        private readonly IModelRepository _modelRepository;
        private readonly IModelCooperationRepository _modelCooperationRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;

        public EditModelCommandHandler(IModelRepository modelRepository, IModelCooperationRepository modelCooperationRepository, ICompanyRepository companyRepository, IMapper mapper)
        {
            _modelRepository = modelRepository;
            _modelCooperationRepository = modelCooperationRepository;
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        public async Task<int> Handle(EditModelCommand request, CancellationToken cancellationToken)
        {
            var modelToEdit = await _modelRepository.GetModelById(request.modelId, cancellationToken);
            var newModel = request.newModelDto;

            if(modelToEdit.Name != newModel.Name)
            {
                modelToEdit.Name = newModel.Name;
            }
            if(modelToEdit.SerialNumber != newModel.SerialNumber)
            {
                newModel.SerialNumber = newModel.SerialNumber;
            }
            if(modelToEdit.Company.Name != newModel.CompanyName)
            {
                await PrepareModelsCompany(modelToEdit, newModel.CompanyName, cancellationToken);
            }

            if (CheckIfCooperationsChanged(modelToEdit.CooperateFrom, newModel.CooperatedModelsIds) || request.cooperationsIdsToBeRemoved != null)
            {
                if(modelToEdit.CooperateFrom == null && newModel.CooperatedModelsIds != null)
                {
                    await _modelCooperationRepository.AddModelCooperation(request.modelId, newModel.CooperatedModelsIds);
                } 

                if(request.cooperationsIdsToBeRemoved != null)
                {
                    await _modelCooperationRepository.RemoveModelCooperations(request.cooperationsIdsToBeRemoved, cancellationToken);
                }                
            }

            if (CheckIfMeasuredValuesChanged(modelToEdit.MeasuredValues, newModel.MeasuredValues))
            {
                modelToEdit.MeasuredValues = GetMeasuredValuesForModel(newModel.MeasuredValues);
            }

            var newMappedModel = _mapper.Map<Model>(newModel);
            await _modelRepository.UpdateModelValuesAsync(modelToEdit.Id, newMappedModel, cancellationToken);

            return modelToEdit.Id;
        }


        private static bool CheckIfCooperationsChanged(ICollection<ModelCooperation> cooperations, ICollection<int> cooperatedModelsIds)
        {
            if (cooperations == null && cooperatedModelsIds == null)
            {
                return false;
            }

            var cooperationsIds = new List<int>();
            
            foreach(var cooperation in cooperations)
            {
                cooperationsIds.Add(cooperation.ModelFromId);
            }

            if(cooperationsIds.Count != cooperatedModelsIds.Count) {
                return true;
            }

            var result = cooperatedModelsIds.OrderBy(x => x).SequenceEqual(cooperationsIds.OrderBy(x => x));


            return result;
        }

        private static bool CheckIfMeasuredValuesChanged(ICollection<MeasuredValue>? oldMeasuredValues, ICollection<MeasuredValueDto>? newMeasuredValues)
        {
            if(oldMeasuredValues == null && newMeasuredValues != null) 
            { 
                return true;
            }
            return false;

        }

        private static bool CheckIfMeasuredRangesChanged(ICollection<MeasuredRange>? oldMeasuredRanges, ICollection<MeasuredRangesDto>? newMeasuredRanges)
        {
            if(oldMeasuredRanges == null && newMeasuredRanges != null)
            {
                return true;
            }
            return false;
        }

        private ICollection<MeasuredValue> GetMeasuredValuesForModel(ICollection<MeasuredValueDto> measuredValuesDtos)
        {
            var measuredValues = new List<MeasuredValue>();
            if(measuredValuesDtos == null)
            {
                return measuredValues;
            } 

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

        private async Task<Model> PrepareModelsCompany(Model model, string companyName, CancellationToken cancellationToken)
        {
            var companyExists = await _companyRepository.CheckIfCompanyExists(companyName);

            if (!companyExists)
            {
                var company = new Company
                {
                    Name = companyName
                };
                model.Company = company;
            }
            else
            {
                model.CompanyId = await _companyRepository.GetCompanyIdByItsName(companyName, cancellationToken);
            }

            return model;
        }

    }
}
