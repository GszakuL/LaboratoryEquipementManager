using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixTypoInDeviceIdentificationNumberColumnName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IdentifiactionNumber",
                table: "Devices",
                newName: "IdentificationNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Devices_IdentifiactionNumber",
                table: "Devices",
                newName: "IX_Devices_IdentificationNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IdentificationNumber",
                table: "Devices",
                newName: "IdentifiactionNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Devices_IdentificationNumber",
                table: "Devices",
                newName: "IX_Devices_IdentifiactionNumber");
        }
    }
}
