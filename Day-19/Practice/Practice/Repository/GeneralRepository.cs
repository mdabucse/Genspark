using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

using IInterfaces;
using Model;
using DbContexFolder;

namespace Repository;

public class GeneralRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly MemberContext _context;
    protected readonly DbSet<T> _dbSet;
    public GeneralRepository(MemberContext context)
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

    public T GetById(int id)
    {
        return _dbSet.Find(id);
    }

    public List<T> GetAll()
    {
        return _dbSet.ToList();
    }
}