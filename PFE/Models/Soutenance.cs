namespace PFE.Models
{
    public class Soutenance
    {
        public int Id { get; set; }

        public string Date { get; set; }
        public int HeureDebut { get; set; }
        public int HeureFin { get; set; }
        public int PFEId { get; set; }
        public PFEModel PFE { get; set; } //one to one relationship
        public int EncadrantId { get; set; }
        public List<Encadrant> Jury { get; set; } //many to many relationship

    }
}
