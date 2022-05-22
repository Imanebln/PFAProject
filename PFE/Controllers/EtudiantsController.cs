using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PFE.Auth;
using PFE.Data;
using PFE.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PFE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class EtudiantsController : ControllerBase
    {

        private readonly PFEContext _context;

        public EtudiantsController(PFEContext context)
        {

            _context = context;
        }


        //Get by year
        [HttpGet]
        [Route("GetByYear")]
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PFEModel>>> GetEtudiantsByYear(int annee)
        {
            var data = _context.Etudiants
            .Join(
            _context.PFEs,
            etudiant => etudiant.Id,
            pfe => pfe.EtudiantId,
            (etudiant, pfe) => new
            {
                id = etudiant.Id,
                nom = etudiant.Nom,
                prenom = etudiant.Prenom,
                filiere = etudiant.Filiere,
                email = etudiant.Email,
                passwordHash = etudiant.PasswordHash,
                username = etudiant.UserName,
                sujet = pfe.Sujet,
                emailEncadrant = pfe.EmailEncadrant,
                nomsociete = pfe.NomSociete,
                techno = pfe.TechnologiesUtilisees,
                ville = pfe.Ville,
                annee = pfe.Annee,

            }
        ).ToList();
           
            return await _context.PFEs.Include(e => e.Etudiant).Where(e => e.Annee == annee).ToListAsync();
        }

        // GET: api/Etudiants
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Etudiant>>> GetEtudiants()
        {
            return await _context.Etudiants.ToListAsync();
        }

        // GET: api/Etudiants/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Etudiant>> GetEtudiant(int id)
        {
            var etudiant = await _context.Etudiants.FindAsync(id);

            if (etudiant == null)
            {
                return NotFound();
            }

            return etudiant;
        }

        // PUT: api/Etudiants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutEtudiant(int id, Etudiant etudiant)
        {
            if (id != etudiant.Id)
            {
                return BadRequest();
            }

            _context.Entry(etudiant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtudiantExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Etudiants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Etudiant>> PostEtudiant(Etudiant etudiant)
        {
            _context.Etudiants.Add(etudiant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEtudiant", new { id = etudiant.Id }, etudiant);
        }

        // DELETE: api/Etudiants/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEtudiant(int id)
        {
            var etudiant = await _context.Etudiants.FindAsync(id);
            if (etudiant == null)
            {
                return NotFound();
            }
            
            _context.Etudiants.Remove(etudiant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtudiantExists(int id)
        {
            return _context.Etudiants.Any(e => e.Id == id);
        }
    }
}
