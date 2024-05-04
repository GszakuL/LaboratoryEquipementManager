﻿using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions
{
    public interface IApplicationDbContext
    {
        DbSet<Device> Devices { get; set; }
        DbSet<Model> Models { get; set; }
        DbSet<Company> Companies { get; set; }
        DbSet<MeasuredValue> MeasuredValues { get; set; }
        DbSet<MeasuredRange> MeasuredRanges { get; set; }
        DbSet<PhysicalMagnitude> PhysicalMagnitudes { get; set; }
        DbSet<Document> Documents { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
