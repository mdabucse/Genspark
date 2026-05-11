using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLayoutDimensions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "column",
                table: "seats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "deck",
                table: "seats",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "row",
                table: "seats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "cols",
                table: "buses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "has_upper_deck",
                table: "buses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "rows",
                table: "buses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "column",
                table: "seats");

            migrationBuilder.DropColumn(
                name: "deck",
                table: "seats");

            migrationBuilder.DropColumn(
                name: "row",
                table: "seats");

            migrationBuilder.DropColumn(
                name: "cols",
                table: "buses");

            migrationBuilder.DropColumn(
                name: "has_upper_deck",
                table: "buses");

            migrationBuilder.DropColumn(
                name: "rows",
                table: "buses");
        }
    }
}
