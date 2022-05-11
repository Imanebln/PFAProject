using Microsoft.AspNetCore.Identity;
using PFE.Auth;
using System.ComponentModel.DataAnnotations.Schema;

namespace PFE.Models
{
    public class Etudiant: IdentityUser
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Filiere { get; set; }

        public string PasswordHash { get; set; }
        public string Sujet { get; set; }
        public string NomSociete { get; set; }
        public string Ville { get; set; }
        public int Annee { get; set; }
        public string TechnologiesUtilisees { get; set; }
        public string EmailEncadrant { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser ApplicationUser { get; set; }

        /*[ForeignKey("FK_AspNetUsers")]
        public string UserId { get; set; }*/

        /*public Etudiant()
        {
            this.PasswordHash = this.UserName;
        }*/



    }
}
