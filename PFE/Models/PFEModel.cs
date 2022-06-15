namespace PFE.Models
{
    public class PFEModel
    {
        public int Id { get; set; }
        public string Ville { get; set; }
        public string Sujet { get; set; }
        public string EmailEncadrant { get; set; }
        public int Annee { get; set; }
        public string NomSociete { get; set; }
        public string TechnologiesUtilisees { get; set; }
        public int? EncadrantId { get; set; }
        public Encadrant Encadrant { get; set; }
        public int EtudiantId { get; set; }
        public Etudiant Etudiant { get; set; }


    }
}
