using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPickupDropPoints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "drop_point",
                table: "trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "pickup_point",
                table: "trips",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "drop_point",
                table: "trips");

            migrationBuilder.DropColumn(
                name: "pickup_point",
                table: "trips");
        }
    }
}
