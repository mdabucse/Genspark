using LMS.BL.Services;
using LMS.Context.DbContextFolder;
using LMS.DAL.Repositories;
using LMS.Interfaces.Repositories;
using LMS.Interfaces.Services;
using Microsoft.Extensions.DependencyInjection;

namespace LMS.FE.Configurations;

public static class ServiceConfiguration
{
    public static ServiceProvider ConfigureServices()
    {
        ServiceCollection services =
            new ServiceCollection();

        services.AddDbContext<LibraryDbContext>();

        services.AddScoped<IMemberRepository,
            MemberRepository>();

        services.AddScoped<IBookRepository,
            BookRepository>();

        services.AddScoped<IBorrowingRepository,
            BorrowingRepository>();

        services.AddScoped<IFineRepository,
            FineRepository>();

        services.AddScoped<IReportRepository,
            ReportRepository>();

        services.AddScoped<IMemberService,
            MemberService>();

        services.AddScoped<IBookService,
            BookService>();

        services.AddScoped<IBorrowingService,
            BorrowingService>();

        services.AddScoped<IReturnService,
            ReturnService>();

        services.AddScoped<IFineService,
            FineService>();

        services.AddScoped<IReportService,
            ReportService>();

        return services.BuildServiceProvider();
    }
}