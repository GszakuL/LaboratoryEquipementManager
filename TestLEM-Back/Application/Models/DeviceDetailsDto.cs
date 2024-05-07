namespace Application.Models
{
    public class DeviceDetailsDto : DeviceDto
    {
        public int Id { get; set; }
        public bool? IsCalibrated { get; set; }
        public string? Producer { get; set; }

        public ICollection<DocumentDto>? DeviceDocuments { get; set; }
        public ICollection<DocumentDto>? ModelDocuments { get; set; }
        public ICollection<ModelDto>? RelatedModels { get; set; }
    }
}
