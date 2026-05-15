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

    // Constructor to initialize the context and DbSet
    public GenericRepository(LibraryDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    // Implementing the methods defined in the IGenericRepository interface
    public void Add(T entity)
    {
        _dbSet.Add(entity);
        _context.SaveChanges();
    }

    // Update method to update an existing entity in the database
    public void Update(T entity)
    {
        _dbSet.Update(entity);
        _context.SaveChanges();
    }

    // Delete method to remove an entity from the database
    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
        _context.SaveChanges();
    }

    // GetById method to retrieve an entity by its ID
    public virtual T? GetById(int id)
    {
        return _dbSet.Find(id);
    }

    // GetAll method to retrieve all entities of type T from the database
    public List<T> GetAll()
    {
        return _dbSet.ToList();
    }
}