using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRemoveCascadeOption : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Devices_DeviceId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Models_ModelId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredRanges_MeasuredValues_MeasuredValueId",
                table: "MeasuredRanges");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredValues_Models_ModelId",
                table: "MeasuredValues");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Devices_DeviceId",
                table: "Documents",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Models_ModelId",
                table: "Documents",
                column: "ModelId",
                principalTable: "Models",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MeasuredRanges_MeasuredValues_MeasuredValueId",
                table: "MeasuredRanges",
                column: "MeasuredValueId",
                principalTable: "MeasuredValues",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeasuredValues_Models_ModelId",
                table: "MeasuredValues",
                column: "ModelId",
                principalTable: "Models",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Devices_DeviceId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Models_ModelId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredRanges_MeasuredValues_MeasuredValueId",
                table: "MeasuredRanges");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredValues_Models_ModelId",
                table: "MeasuredValues");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Devices_DeviceId",
                table: "Documents",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Models_ModelId",
                table: "Documents",
                column: "ModelId",
                principalTable: "Models",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeasuredRanges_MeasuredValues_MeasuredValueId",
                table: "MeasuredRanges",
                column: "MeasuredValueId",
                principalTable: "MeasuredValues",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeasuredValues_Models_ModelId",
                table: "MeasuredValues",
                column: "ModelId",
                principalTable: "Models",
                principalColumn: "Id");
        }
    }
}
