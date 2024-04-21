using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public abstract class ApiController : ControllerBase
    {
        private ISender _sender;
        protected ISender Sender => _sender ??= HttpContext.RequestServices.GetService<ISender>();

    }
}
