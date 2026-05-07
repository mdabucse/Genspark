using System;

namespace NotificationAppModelLibrary
{
    public interface IRepository<K,T> where T : class
    {
        public T Create( T value);
        public T? Read(K key);
        public T? Update(K key, T value);
        public T? Delete(K key);
    }
}