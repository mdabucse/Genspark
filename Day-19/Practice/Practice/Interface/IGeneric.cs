using System.Collections.Generic;

namespace IInterfaces;

public interface IGenericRepository<T>
{
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
    T GetById(int id);
    List<T> GetAll();
}