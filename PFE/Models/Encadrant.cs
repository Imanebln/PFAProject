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
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser ApplicationUser { get; set; }
        public List<Soutenance> Soutenances { get; set; }
        public List<PFEModel> PFEs { get; set; }


    }
}
