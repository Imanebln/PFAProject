﻿
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npoi.Mapper;
using NPOI.SS.UserModel;
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
    [Authorize (Roles = "Admin")]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly PFEContext _context;


        public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, PFEContext context)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _context = context;

        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByNameAsync(model.Username);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );
                dynamic? userData = null;
                if(userRoles.Contains(UserRoles.Admin))
                {
                    userData = await _context.Admins.Where(a => a.Id.Equals(user.Id)).FirstOrDefaultAsync();
                }
                else if (userRoles.Contains(UserRoles.Encadrant))
                {
                    userData = await _context.Encadrants.Where(a => a.Id.Equals(user.Id)).FirstOrDefaultAsync();
                }
                else if (userRoles.Contains(UserRoles.Etudiant))
                {
                    userData = await _context.Etudiants.Where(a => a.Id.Equals(user.Id)).FirstOrDefaultAsync();
                }

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo,
                    roles = userRoles
                    /*email = user.Email,
                    id = userData.Id,
                    Nom = userData.Nom,
                    Prenom = userData.Prenom*/
                });
            }
            return Unauthorized();
        }

        
        [HttpPost]
        [Route("add-etudiant")]
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        public async Task<IActionResult> RegisterEtudiant([FromBody] RegisterEtudiant model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            string pass = model.Username.ToString()+"GI2022.";
            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                PasswordHash = pass,
                EmailConfirmed = true
                
            };
            var result = await userManager.CreateAsync(user, pass);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            if (!await roleManager.RoleExistsAsync(UserRoles.Etudiant))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Etudiant));
            
            
            if (await roleManager.RoleExistsAsync(UserRoles.Etudiant))
            {
                await userManager.AddToRoleAsync(user, UserRoles.Etudiant);
            }

            var etudiant = new Etudiant()
            {
                Nom = model.Nom,
                Prenom = model.Prenom,
                Filiere = "GI",
                Email = model.Email,
                UserName = model.Username,
                PasswordHash = pass,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserId = user.Id,



            };
            _context.Etudiants.Add(etudiant);
            await _context.SaveChangesAsync();

            var pfe = new PFEModel()
            {
                EtudiantId = etudiant.Id,
                Sujet = model.Sujet,
                NomSociete = model.NomSociete,
                Ville = model.Ville,
                Annee = model.Annee,
                TechnologiesUtilisees = model.TechnologiesUtilisees,
                EmailEncadrant = model.EmailEncadrant
            };
           
            
            _context.PFEs.Add(pfe);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                StatusCode(StatusCodes.Status422UnprocessableEntity, "database error");
            }


            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
            /*return base.Ok(mapper.Map<Etudiant>(user));*/
        }

        //Upload excel file
        [HttpPost]
        [Route("UploadExcelFile")]
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Etudiant>>> UploadExcelFile(IFormFile file, int year)
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
            var items = importer.Take<ExcelModel>();

            if (items.Any(i =>
            {
                return (i.Value.Nom == null || i.Value.Prenom == null || i.Value.Ville == null
                || i.Value.Email == null || i.Value.Sujet == null || i.Value.NomSociete == null
                || i.Value.TechnologiesUtilisees == null || i.Value.EmailEncadrant == null || i.Value.Filiere == null);
            }))
            {
                return BadRequest("Column not found");
            }

            var etudiants = _context.PFEs.Include(e => e.Etudiant).Where(e => e.Annee == year).ToList();

              foreach (var item in items)
              {
                if (etudiants.Any(et => et.Etudiant.UserName.Equals(item.Value.Nom.Split(' ')[0] + '.' + item.Value.Prenom.Split(' ')[0]) || item.Value == null ))                   
                {
                    continue;
                }

                //add etudiant to AspNetUsers
                var userExists = await userManager.FindByNameAsync(item.Value.Nom.Split(' ')[0] + '.' + item.Value.Prenom.Split(' ')[0]);
                if (userExists != null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error to add in AspNetUsers", Message = "User already exists!" });

                string pass = (item.Value.Nom.Split(' ')[0] + '.' + item.Value.Prenom.Split(' ')[0]).ToString() + "GI2022.";
                ApplicationUser user = new ApplicationUser()
                {
                    Email = item.Value.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = item.Value.Nom.Split(' ')[0] + '.' + item.Value.Prenom.Split(' ')[0],
                    PasswordHash = pass,
                    EmailConfirmed = true

                };
                var result = await userManager.CreateAsync(user, pass);
                if (!result.Succeeded)
                    return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

                if (!await roleManager.RoleExistsAsync(UserRoles.Etudiant))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Etudiant));


                if (await roleManager.RoleExistsAsync(UserRoles.Etudiant))
                {
                    await userManager.AddToRoleAsync(user, UserRoles.Etudiant);
                }

                Etudiant etudiant = new Etudiant();

                etudiant.UserId = user.Id;
                etudiant.Nom = item.Value.Nom;
                etudiant.Prenom = item.Value.Prenom;
                etudiant.Email = item.Value.Email;
                etudiant.NormalizedEmail = item.Value.Email;
                etudiant.UserName = etudiant.Nom.Split(' ')[0] + '.' + etudiant.Prenom.Split(' ')[0];
                etudiant.PasswordHash = pass;
                etudiant.Filiere = item.Value.Filiere;

                _context.Etudiants.Add(etudiant);
                await _context.SaveChangesAsync();

                PFEModel pfe = new PFEModel();

                pfe.EtudiantId = etudiant.Id;
                pfe.Sujet = item.Value.Sujet;
                pfe.NomSociete = item.Value.NomSociete;
                pfe.Ville = item.Value.Ville;
                pfe.TechnologiesUtilisees = item.Value.TechnologiesUtilisees;
                pfe.EmailEncadrant = item.Value.EmailEncadrant;
                pfe.Annee = year;
                pfe.EtudiantId = etudiant.Id;
                
                _context.PFEs.Add(pfe);
                await _context.SaveChangesAsync();
            }

            return await _context.Etudiants.ToListAsync();
        }

        [HttpPost]
        [Route("add-encadrant")]
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        public async Task<IActionResult> RegisterEncadrant([FromBody] RegisterUser model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            string pass = model.Username.ToString() + "GI2022.";
            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                PasswordHash = pass,
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(user, pass);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });


            if (!await roleManager.RoleExistsAsync(UserRoles.Encadrant))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Encadrant));

            if (await roleManager.RoleExistsAsync(UserRoles.Encadrant))
            {
                await userManager.AddToRoleAsync(user, UserRoles.Encadrant);
            }

            var encadrant = new Encadrant()
            {
                Nom = model.Nom,
                Prenom = model.Prenom,
                Filiere = "GI",
                Email = model.Email,
                UserName = model.Username,
                PasswordHash = pass,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserId = user.Id,


            };

            _context.Encadrants.Add(encadrant);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                StatusCode(StatusCodes.Status422UnprocessableEntity, "database error");
            }


            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }


        [HttpPost]
        [Route("register-admin")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
            if (!await roleManager.RoleExistsAsync(UserRoles.Etudiant))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Etudiant));
            if (!await roleManager.RoleExistsAsync(UserRoles.Encadrant))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Encadrant));

            if (await roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            var admin = new Admin()
            {
                Filiere = "GI",
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                Nom = model.Nom,
                Prenom = model.Prenom,
                UserName = model.Username


            };

            _context.Admins.Add(admin);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                StatusCode(StatusCodes.Status422UnprocessableEntity, "database error");
            }

            return Ok(new Response { Status = "Success", Message = "User created successfully!" });
        }



        //Ajouter un encadrant
        /*[Route("AjouterProf")]
        [HttpPost]
        public async Task<ActionResult<Encadrant>> AjouterEncadrant(Encadrant encadrant)
        {
            _context.Encadrants.Add(encadrant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEncadrant", new { id = encadrant.Id }, encadrant);
        }*/


        //Modifer un encadrant

        
        [Route("ModifierProf")]
        [HttpPost]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult> ModifierEncadrant(int id, Encadrant encadrant)
        {
            if (id != encadrant.Id)
            {
                return BadRequest();
            }

            _context.Entry(encadrant).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EncadrantExists(id))
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
        private bool EncadrantExists(int id)
        {
            return _context.Encadrants.Any(e => e.Id == id);
        }

        //supprimer encadrant
        [Authorize(Roles = "Admin")]
        [Route("SuppProf")]
        [HttpDelete]
        public async Task<IActionResult> SupprimerEncadrant(int id)
        {

            //fetching and filter specific member id record   
            var encadrant = await _context.Encadrants.FindAsync(id);
            
            //checking fetched or not with the help of NULL or NOT.  
            if (encadrant != null)
            {
                var us = await _context.Users.FindAsync(encadrant.UserId);
                
                if(us != null)
                {
                    _context.Encadrants.Remove(encadrant);
                    _context.Users.Remove(us);
                    await _context.SaveChangesAsync();
                }
                
            }
            else
            {
                //return response error as Not Found  with exception message.  
                return NotFound();
            }
            return NoContent();

        }

        // *****************************************gerer l'espace etudiant*******************************************************
        //Ajouter un etudiant
        /*[Route("AjouterEtudiant")]
        [HttpPost]
        public async Task<ActionResult<Etudiant>> AjouterEtudiant(Etudiant etudiant)
        {
            _context.Etudiants.Add(etudiant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEtudiant", new { id = etudiant.Id }, etudiant);
        }*/

        //Modifer un etudiant
        [Authorize(Roles = "Admin")]
        [Route("ModifierEtudiant")]
        [HttpPost]
        public async Task<ActionResult> ModifierEtudiant(int id, Etudiant etudiant)
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
        private bool EtudiantExists(int id)
        {
            return _context.Etudiants.Any(e => e.Id == id);
        }

        //supprimer etudiant
        [Authorize(Roles = "Admin")]
        [Route("SuppEtudiant")]
        [HttpDelete]
        public async Task<IActionResult> SupprimerEtudiant(int id)
        {

            //fetching and filter specific member id record   
            //delete from pfe first

            var pfe = _context.PFEs.Where(p => p.Id == id).FirstOrDefault();

            if (pfe != null)
            {
                var etudiant = _context.Etudiants.Where(e => e.Id == pfe.EtudiantId).FirstOrDefault();
                if (etudiant != null)
                {
                    var us = _context.Users.Where(u => u.Id == etudiant.UserId).FirstOrDefault();
                    if (us != null)
                    {
                        _context.PFEs.Remove(pfe);
                        _context.Etudiants.Remove(etudiant);
                        _context.Users.Remove(us);

                        var stc = _context.Soutenance.Where(s => s.PFE.Id == id).FirstOrDefault();
                        if (stc != null)
                        {
                            _context.Soutenance.Remove(stc);
                        }

                        await _context.SaveChangesAsync();
                    }
                }

            }
            return NoContent();
        }

        [Route("AffecterEncadrant")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PFEModel>>> AffecterEncadrant(int id, int idEncadrant)//, PFEModel pfe)
        {
            var pf = _context.PFEs.Include(e => e.Etudiant).Where(e => e.Id == id).First();
            if (pf == null) return BadRequest();
            else
            {
                pf.EncadrantId = idEncadrant;
                await _context.SaveChangesAsync();
            }
            return await _context.PFEs.ToArrayAsync();
        }

        
        //get encadrant by id pfe
        [Route("GetEncadrantByIdPFE")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PFEModel>> GetEncadrantByIdPFE(int id)
        {

            var pfe = _context.PFEs.Include(p => p.Encadrant).Where(p => p.Id == id).FirstOrDefaultAsync();

            if (pfe == null)
            {
                return NotFound();
            }
            else
            {
                return await pfe;
            }
        }

        /*Gestion soutenance*/

        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        [Route("GererSoutenance")]
        [HttpPost]
        public async Task<ActionResult<IEnumerable<Soutenance>>> GererSoutenance(int idPfe, int idEncad1, int idEncad2, string dateStc, string heureDebut, string heureFin)
        {
            var enc1 = _context.Encadrants.Where(e => e.Id.Equals(idEncad1)).First();
            var enc2 = _context.Encadrants.Where(e => e.Id.Equals(idEncad2)).First();

            Soutenance soutenance = new Soutenance();

            soutenance.PFEId = idPfe;
            //soutenance.EncadrantId = idEncadPrincipal;
            soutenance.Date = dateStc.Split(' ')[0];
            soutenance.HeureDebut = heureDebut;
            soutenance.HeureFin = heureFin;

            List<Encadrant> list = new List<Encadrant>();
            //if table soutenance kawya => pas de traitement
            if (_context.Soutenance.Count() == 0)
            {
                list.Add(enc1);
                list.Add(enc2);

                soutenance.Jury = list;
                _context.Add(soutenance);
                await _context.SaveChangesAsync();
            }
            else
            {
                var testEncad1 = _context.Soutenance.Where(s => s.Date == dateStc && s.HeureDebut == heureDebut && s.HeureFin == heureFin)
                                                                .Include(e => e.Jury).Where(i => i.Id == idEncad1).FirstOrDefault();

                if (testEncad1 == null)
                {
                    list.Add(enc1);
                }
                else
                {
                    new Response { Status = "Error", Message = enc1.Nom + " " + enc1.Prenom + " est deja affecte a une soutenance" };
                }
                //s.Date == dateStc 
                //&& DateTime.ParseExact(s.HeureDebut, "HH:mm", CultureInfo.InvariantCulture) >= DateTime.ParseExact(heureDebut, "HH:mm", CultureInfo.InvariantCulture)
                //&& DateTime.ParseExact(s.HeureFin, "HH:mm", CultureInfo.InvariantCulture) <= DateTime.ParseExact(heureFin, "HH:mm", CultureInfo.InvariantCulture))
                //.Include(e => e.Jury).Where(i => i.Id == idEncad2).FirstOrDefault();
                var testEncad2 = _context.Soutenance.Where(s => s.Date == dateStc && s.HeureDebut == heureDebut && s.HeureFin == heureFin)
                                                                .Include(e => e.Jury).Where(i => i.Id == idEncad2).FirstOrDefault();
                if (testEncad2 == null)
                {
                    list.Add(enc2);
                }
                else
                {
                    new Response { Status = "Error", Message = enc1.Nom + " " + enc1.Prenom + " est deja affecte a une soutenance" };
                }

                soutenance.Jury = list;
                if (list.Count >= 2)
                {
                    _context.Add(soutenance);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    new Response { Status = "Error", Message = "Liste invalide" };
                }
            }

            return await _context.Soutenance.ToListAsync();
        }

        [HttpGet]
        [Route("GetSoutenanceByDate")]
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Soutenance>>> GetSoutenanceByDate(string date)
        {
            return await _context.Soutenance.Include(e => e.PFE.Etudiant).Where(e => e.Date == date).ToListAsync();
        }

    }
}
