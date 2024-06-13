﻿// <auto-generated />
using System;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(LemDbContext))]
    [Migration("20240528192458_ChangeIdsToNullable")]
    partial class ChangeIdsToNullable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Domain.Entities.Company", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("Domain.Entities.Device", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("CalibrationPeriodInYears")
                        .HasColumnType("int");

                    b.Property<string>("IdentifiactionNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool?>("IsCalibrated")
                        .HasColumnType("bit");

                    b.Property<bool?>("IsCalibrationCloseToExpire")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("LastCalibrationDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("ModelId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ProductionDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("StorageLocation")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("IdentifiactionNumber")
                        .IsUnique();

                    b.HasIndex("ModelId");

                    b.ToTable("Devices");
                });

            modelBuilder.Entity("Domain.Entities.Document", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<DateTime?>("DateAdded")
                        .HasColumnType("datetime2");

                    b.Property<int?>("DeviceId")
                        .HasColumnType("int");

                    b.Property<string>("Format")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ModelId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("DeviceId");

                    b.HasIndex("ModelId");

                    b.ToTable("Documents");
                });

            modelBuilder.Entity("Domain.Entities.MeasuredRange", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<decimal?>("AccuracyInPercet")
                        .HasPrecision(5, 3)
                        .HasColumnType("decimal(5,3)");

                    b.Property<int?>("MeasuredValueId")
                        .HasColumnType("int");

                    b.Property<string>("Range")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("MeasuredValueId");

                    b.ToTable("MeasuredRanges");
                });

            modelBuilder.Entity("Domain.Entities.MeasuredValue", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("ModelId")
                        .HasColumnType("int");

                    b.Property<int?>("PhysicalMagnitudeId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ModelId");

                    b.HasIndex("PhysicalMagnitudeId");

                    b.ToTable("MeasuredValues");
                });

            modelBuilder.Entity("Domain.Entities.Model", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CompanyId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("SerialNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("CompanyId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.HasIndex("SerialNumber")
                        .IsUnique();

                    b.ToTable("Models");
                });

            modelBuilder.Entity("Domain.Entities.ModelCooperation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ModelFromId")
                        .HasColumnType("int");

                    b.Property<int>("ModelToId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ModelFromId");

                    b.HasIndex("ModelToId");

                    b.ToTable("ModelCooperation");
                });

            modelBuilder.Entity("Domain.Entities.PhysicalMagnitude", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Unit")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("PhysicalMagnitudes");
                });

            modelBuilder.Entity("Domain.Entities.Device", b =>
                {
                    b.HasOne("Domain.Entities.Model", "Model")
                        .WithMany("Devices")
                        .HasForeignKey("ModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Model");
                });

            modelBuilder.Entity("Domain.Entities.Document", b =>
                {
                    b.HasOne("Domain.Entities.Device", "Device")
                        .WithMany("Documents")
                        .HasForeignKey("DeviceId");

                    b.HasOne("Domain.Entities.Model", "Model")
                        .WithMany("Documents")
                        .HasForeignKey("ModelId");

                    b.Navigation("Device");

                    b.Navigation("Model");
                });

            modelBuilder.Entity("Domain.Entities.MeasuredRange", b =>
                {
                    b.HasOne("Domain.Entities.MeasuredValue", "MeasuredValue")
                        .WithMany("MeasuredRanges")
                        .HasForeignKey("MeasuredValueId");

                    b.Navigation("MeasuredValue");
                });

            modelBuilder.Entity("Domain.Entities.MeasuredValue", b =>
                {
                    b.HasOne("Domain.Entities.Model", "Model")
                        .WithMany("MeasuredValues")
                        .HasForeignKey("ModelId");

                    b.HasOne("Domain.Entities.PhysicalMagnitude", "PhysicalMagnitude")
                        .WithMany("MeasuredValues")
                        .HasForeignKey("PhysicalMagnitudeId");

                    b.Navigation("Model");

                    b.Navigation("PhysicalMagnitude");
                });

            modelBuilder.Entity("Domain.Entities.Model", b =>
                {
                    b.HasOne("Domain.Entities.Company", "Company")
                        .WithMany("Models")
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("Domain.Entities.ModelCooperation", b =>
                {
                    b.HasOne("Domain.Entities.Model", "ModelFrom")
                        .WithMany("CooperateFrom")
                        .HasForeignKey("ModelFromId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Domain.Entities.Model", "ModelTo")
                        .WithMany("CooperateTo")
                        .HasForeignKey("ModelToId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("ModelFrom");

                    b.Navigation("ModelTo");
                });

            modelBuilder.Entity("Domain.Entities.Company", b =>
                {
                    b.Navigation("Models");
                });

            modelBuilder.Entity("Domain.Entities.Device", b =>
                {
                    b.Navigation("Documents");
                });

            modelBuilder.Entity("Domain.Entities.MeasuredValue", b =>
                {
                    b.Navigation("MeasuredRanges");
                });

            modelBuilder.Entity("Domain.Entities.Model", b =>
                {
                    b.Navigation("CooperateFrom");

                    b.Navigation("CooperateTo");

                    b.Navigation("Devices");

                    b.Navigation("Documents");

                    b.Navigation("MeasuredValues");
                });

            modelBuilder.Entity("Domain.Entities.PhysicalMagnitude", b =>
                {
                    b.Navigation("MeasuredValues");
                });
#pragma warning restore 612, 618
        }
    }
}