using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIdsToNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredRanges_MeasuredValues_MeasuredValueId",
                table: "MeasuredRanges");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredValues_Models_ModelId",
                table: "MeasuredValues");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredValues_PhysicalMagnitudes_PhysicalMagnitudeId",
                table: "MeasuredValues");

            migrationBuilder.AlterColumn<int>(
                name: "PhysicalMagnitudeId",
                table: "MeasuredValues",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ModelId",
                table: "MeasuredValues",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Range",
                table: "MeasuredRanges",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "MeasuredValueId",
                table: "MeasuredRanges",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "AccuracyInPercet",
                table: "MeasuredRanges",
                type: "decimal(5,3)",
                precision: 5,
                scale: 3,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,3)",
                oldPrecision: 5,
                oldScale: 3);

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

            migrationBuilder.AddForeignKey(
                name: "FK_MeasuredValues_PhysicalMagnitudes_PhysicalMagnitudeId",
                table: "MeasuredValues",
                column: "PhysicalMagnitudeId",
                principalTable: "PhysicalMagnitudes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredRanges_MeasuredValues_MeasuredValueId",
                table: "MeasuredRanges");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredValues_Models_ModelId",
                table: "MeasuredValues");

            migrationBuilder.DropForeignKey(
                name: "FK_MeasuredValues_PhysicalMagnitudes_PhysicalMagnitudeId",
                table: "MeasuredValues");

            migrationBuilder.AlterColumn<int>(
                name: "PhysicalMagnitudeId",
                table: "MeasuredValues",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ModelId",
                table: "MeasuredValues",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Range",
                table: "MeasuredRanges",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MeasuredValueId",
                table: "MeasuredRanges",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "AccuracyInPercet",
                table: "MeasuredRanges",
                type: "decimal(5,3)",
                precision: 5,
                scale: 3,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,3)",
                oldPrecision: 5,
                oldScale: 3,
                oldNullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_MeasuredValues_PhysicalMagnitudes_PhysicalMagnitudeId",
                table: "MeasuredValues",
                column: "PhysicalMagnitudeId",
                principalTable: "PhysicalMagnitudes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
