using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Application.Abstractions;

namespace Infrastructure
{
    public class LemDbContext : DbContext, IApplicationDbContext
    {
        public LemDbContext(DbContextOptions<LemDbContext> options) : base(options)
        {
        }

        public DbSet<Device> Devices { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<MeasuredValue> MeasuredValues { get; set; }
        public DbSet<MeasuredRange> MeasuredRanges { get; set; }
        public DbSet<PhysicalMagnitude> PhysicalMagnitudes { get; set; }
        public DbSet<Document> Documents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Device>(d =>
            {
                d.HasOne(x => x.Model)
                .WithMany(m => m.Devices)
                .HasForeignKey(x => x.ModelId);

                d.HasIndex(x => x.IdentifiactionNumber)
                .IsUnique();

                d.HasMany(x => x.Documents)
                .WithOne(x => x.Device)
                .HasForeignKey(x => x.DeviceId);
            });

            modelBuilder.Entity<Model>(m =>
            {
                m.HasOne(m => m.Company)
                .WithMany(c => c.Models)
                .HasForeignKey(m => m.CompanyId);

                m.HasIndex(x => x.SerialNumber)
                .IsUnique();

                m.HasIndex(x => x.Name)
                .IsUnique();

                m.HasMany(x => x.MeasuredValues)
                .WithOne(x => x.Model)
                .HasForeignKey(x => x.ModelId);

                m.HasMany(x => x.Documents)
                .WithOne(x => x.Model)
                .HasForeignKey(x => x.ModelId);
            });

            modelBuilder.Entity<Company>(x => x.HasIndex(x => x.Name).IsUnique());

            modelBuilder.Entity<PhysicalMagnitude>(pm =>
            {
                pm.HasMany(x => x.MeasuredValues)
                .WithOne(x => x.PhysicalMagnitude)
                .HasForeignKey(x => x.PhysicalMagnitudeId);
            });

            modelBuilder.Entity<MeasuredValue>(mv =>
            {
                mv.HasMany(x => x.MeasuredRanges)
                .WithOne(x => x.MeasuredValue)
                .HasForeignKey(x => x.MeasuredValueId);
            });

            modelBuilder.Entity<ModelCooperation>(mc =>
            {
                mc.HasOne(x => x.ModelFrom)
                .WithMany(x => x.CooperateFrom)
                .HasForeignKey(x => x.ModelFromId)
                .OnDelete(DeleteBehavior.Cascade);

                mc.HasOne(x => x.ModelTo)
                .WithMany(x => x.CooperateTo)
                .HasForeignKey(x => x.ModelToId)
                .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<MeasuredRange>(mr =>
                mr.Property(x => x.AccuracyInPercet)
                .HasColumnType("decimal(5,3)")
                .HasPrecision(5, 3)
            );
        }
    }
}
