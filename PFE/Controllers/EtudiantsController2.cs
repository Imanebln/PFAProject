/*#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npoi.Mapper;
using NPOI.SS.UserModel;
using PFE.Data;
using PFE.Models;

namespace PFE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EtudiantsController : ControllerBase
    {
        private readonly PFEContext _context;

        public EtudiantsController(PFEContext context)
        {
            _context = context;
        }

        // GET: api/Etudiants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Etudiant>>> GetEtudiants()
        {
            return await _context.Etudiants.ToListAsync();
        }

        // GET: api/Etudiants/5
        [HttpGet("{id}")]
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
        public async Task<ActionResult<Etudiant>> PostEtudiant(Etudiant etudiant)
        {
            _context.Etudiants.Add(etudiant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEtudiant", new { id = etudiant.Id }, etudiant);
        }

        // DELETE: api/Etudiants/5
        [HttpDelete("{id}")]
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

        [HttpDelete]
        [Route("DeleteAllEtudiants")]
        public async Task<ActionResult<IEnumerable<Etudiant>>> DeleteAllEtudiants()
        {
            var etudiant = await _context.Etudiants.ToListAsync();

            foreach (var item in etudiant)
            {
                _context.Etudiants.Remove(item);
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }

        [HttpPost]
        [Route("UploadExcelFile")]
        public async Task<ActionResult<IEnumerable<Etudiant>>> UploadExcelFile(IFormFile file, int sheetIndex = 0)
        {
            IWorkbook workbook;
            var file2 = file.OpenReadStream();

            try
            {
                workbook = WorkbookFactory.Create(file2);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message + "Could not open file");
            }

            var importer = new Mapper(workbook);
            var items = importer.Take<ExcelModel>(sheetIndex);

            if (items.Any(i =>
            {
                return (i.Value.Nom == null || i.Value.Prenom == null || i.Value.Ville == null
                || i.Value.Email == null || i.Value.Sujet == null || i.Value.NomSociete == null
                || i.Value.TechnologiesUtilisees == null || i.Value.EmailEncadrant == null || i.Value.Filiere == null);
            }))
            {
                return BadRequest("Column not found");
            }

            //await DeleteAllEtudiants();

            foreach (var item in items)
            {
                Etudiant etudiant = new Etudiant();

                
                etudiant.Email = item.Value.Email;
                etudiant.Sujet = item.Value.Sujet;
                etudiant.NomSociete = item.Value.NomSociete;
                etudiant.Ville = item.Value.Ville;
                etudiant.TechnologiesUtilisees = item.Value.TechnologiesUtilisees;
                etudiant.EmailEncadrant = item.Value.EmailEncadrant;
                etudiant.Nom = item.Value.Nom;
                etudiant.Prenom = item.Value.Prenom;
                etudiant.Filiere = item.Value.Filiere;
                etudiant.NormalizedEmail = item.Value.Email;
                etudiant.UserName = item.Value.Prenom;

                _context.Etudiants.Add(etudiant);
                await _context.SaveChangesAsync();
            }
            return await _context.Etudiants.ToListAsync();
        }

        [HttpPost("students/excel/upload")]
        [RequestSizeLimit(bytes: 5_000_000)]
        public async Task<IActionResult> AddStudentsList(IFormFile file)
        {
            if (file.Length <= 0)
                return BadRequest("Empty file");
            var result = await UploadExcelFile(file);
            return Ok();
        }

        private bool EtudiantExists(int id)
        {
            return _context.Etudiants.Any(e => e.Id == id);
        }
    }
}
*/