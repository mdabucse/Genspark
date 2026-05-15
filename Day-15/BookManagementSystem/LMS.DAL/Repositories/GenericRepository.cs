using LMS.Context.DbContextFolder;
using LMS.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace LMS.DAL.Repositories;

public class GenericRepository<T>
    : IGenericRepository<T>
    where T : class
{
    protected readonly LibraryDbContext _context;

    protected readonly DbSet<T> _dbSet;

    public GenericRepository(
        LibraryDbContext context)
    {
        _context = context;

        _dbSet = _context.Set<T>();
    }

    public void Add(T entity)
    {
        _dbSet.Add(entity);

        _context.SaveChanges();
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);

        _context.SaveChanges();
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);

        _context.SaveChanges();
    }

    public virtual T? GetById(int id)
    {
        return _dbSet.Find(id);
    }

    public List<T> GetAll()
    {
        return _dbSet.ToList();
    }
}