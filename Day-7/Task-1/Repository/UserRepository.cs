using System;
using System.Collections.Generic;
using IUser;
using Users;

namespace UsersRepo 
{
    public class UserRepository : IRepository<string, UserDetails>
    {
        Dictionary<string, UserDetails> _userMap = new Dictionary<string, UserDetails>();
        public UserDetails Create(UserDetails value)
        {
            // Implementation for creating a user
            _userMap[value.UserName ?? ""] = value;
            return value;
        }

        public UserDetails? Read(string name)
        {
            // Implementation for reading a user
            if (_userMap.TryGetValue(name, out var user))
            {
                return user;
            }
            return null;
        }

        public UserDetails? Update(string name, UserDetails value)
        {
            // Implementation for updating a user
            if (_userMap.TryGetValue(name, out var user))
            {
                _userMap[name] = value;
                return user;
            }
            return null;
        }

        public UserDetails? Delete(string name)
        {
            // Implementation for deleting a user
            if (_userMap.TryGetValue(name, out var user))
            {
                _userMap.Remove(name);
                return user;
            }
            return null;
        }
    }
}
