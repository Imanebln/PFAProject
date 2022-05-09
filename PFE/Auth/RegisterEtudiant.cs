using System.ComponentModel.DataAnnotations;

namespace PFE.Auth
{
    public class RegisterEtudiant
    {

        /*[Required(ErrorMessage = "User Name is required")]*/
        public string Username { get; set; }

        /*[Required(ErrorMessage = "Nom is required")]*/
        public string Nom { get; set; }

        /*[Required(ErrorMessage = "Prenom is required")]*/
        public string Prenom { get; set; }


       /* [Required(ErrorMessage = "Email is required")]*/
        public string Email { get; set; }

        public string Filiere = "GI";
        public string Sujet { get; set; }
        public string NomSociete { get; set; }
        public string Ville { get; set; }
        public int Annee { get; set; }
        public string TechnologiesUtilisees { get; set; }
        public string EmailEncadrant { get; set; }
    }
}
