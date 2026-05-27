using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace ExcelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        // Temporary storage
        private static List<UserData> users = new();

        // POST API
        [HttpPost]
        public IActionResult AddUser([FromBody] UserData user)
        {
            users.Add(user);

            return Ok(new
            {
                Message = "User Added Successfully"
            });
        }

        // GET API
        [HttpGet("excel")]
        public IActionResult DownloadExcel()
        {
            using var workbook = new XLWorkbook();

            var worksheet = workbook.Worksheets.Add("Users");

            // Header
            worksheet.Cell(1, 1).Value = "Name";
            worksheet.Cell(1, 2).Value = "Phone";
            worksheet.Cell(1, 3).Value = "Email";
            worksheet.Cell(1, 4).Value = "Age";

            // Data
            for (int i = 0; i < users.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = users[i].Name;
                worksheet.Cell(i + 2, 2).Value = users[i].Phone;
                worksheet.Cell(i + 2, 3).Value = users[i].Email;
                worksheet.Cell(i + 2, 4).Value = users[i].Age;
            }

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            var content = stream.ToArray();

            return File(
                content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Users.xlsx"
            );
        }
    }
}