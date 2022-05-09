using Microsoft.AspNetCore.Identity;
using PFE.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFE.Models
{
    public class Encadrant : IdentityUser

    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }

        public string Filiere { get; set; }

        [ForeignKey("FK_AspNetUsers")]
        public string UserId { get; set; }

    }
}
