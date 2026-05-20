namespace Task_1.Repository;

public interface IGenericRepository<T> where T : class
{
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
    T? GetById(int id);
    List<T> GetAll();
}