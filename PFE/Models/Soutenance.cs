namespace PFE.Models
{
    public class Soutenance
    {
        public int Id { get; set; }

       
        public string Date { get; set; }
        public string HeureDebut { get; set; }
        public string HeureFin { get; set; }
        public int PFEId { get; set; }
        public PFEModel PFE { get; set; } //one to one relationship
        public List<Encadrant> Jury { get; set; } //many to many relationship

    }
}
