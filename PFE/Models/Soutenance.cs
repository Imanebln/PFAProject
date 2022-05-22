namespace PFE.Models
{
    public class Soutenance
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }
        public DateTime HeureDebut { get; set; }
        public DateTime HeureFin { get; set; }
        public int EtudiantId { get; set; }
        public Etudiant Etudiant { get; set; } //one to one relationship
        public int PFEId { get; set; }
        public PFEModel PFE { get; set; } //one to one relationship
        public int EncadrantId { get; set; }
        public List<Encadrant> Jury { get; set; } //many to many relationship

    }
}
