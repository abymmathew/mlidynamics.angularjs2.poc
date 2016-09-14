using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cch.angularjs2.poc.Services
{
    public interface ISmsSender
    {
        Task SendSmsAsync(string number, string message);
    }
}
