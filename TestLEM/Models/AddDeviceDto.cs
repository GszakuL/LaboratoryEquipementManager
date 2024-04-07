﻿namespace TestLEM.Models
{
    public class AddDeviceDto
    {
        public string IdentifiactionNumber { get; set; }
        public DateTime? ProductionDate { get; set; }
        public int? CalibrationPeriodInYears { get; set; }
        public DateTime? LastCalibrationDate { get; set; }
        public bool? IsCalibrated { get; set; }
        public bool? IsCalibrationCloseToExpire { get; set; }
        public string? StorageLocation { get; set; }
        public string ModelName { get; set; }
        public string ModelSerialNumber { get; set; }
        public string Company { get; set; }
        public ICollection<MeasuredValueDto>? MeasuredValues { get; set; }
        //public ICollection<string>? RelatedDevicesNames { get; set; }
    }
}
