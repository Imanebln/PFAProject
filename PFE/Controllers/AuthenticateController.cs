

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npoi.Mapper;
using NPOI.HSSF.Util;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using PFE.Auth;
using PFE.Data;
using PFE.Models;
using System.Data;
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
                EmailEncadrant = model.EmailEncadrant,
                //EncadrantId = _context.Encadrants.First().Id
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
                //pfe.EncadrantId = _context.Encadrants.First().Id;
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

            var encadrant = new Encadrant()
            {
                Nom = model.Nom,
                Prenom = model.Prenom,
                Filiere = "GI",
                Email = model.Email,
                UserName = model.Username,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserId = user.Id
            };

            _context.Admins.Add(admin);
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
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
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
               
                if (us != null)
                {
                    
                    var stc = _context.Soutenance.Where(s => s.PFE.EncadrantId == id || s.Jury.Any(j => j.Id == id)).ToList();
                    if (stc != null)
                    {
                        foreach (var item in stc)
                        {
                            _context.Soutenance.Remove(item);
                        }
                    }
                    var encEtu = _context.PFEs.Where(p => p.EncadrantId == id).ToList();
                    if (encEtu != null)
                    {
                        foreach (var item in encEtu)
                        {
                            item.EncadrantId = null;
                        }
                    }
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
                        var stc = _context.Soutenance.Where(s => s.PFE.Id == id).FirstOrDefault();
                        if (stc != null)
                        {
                            _context.Soutenance.Remove(stc);
                            _context.PFEs.Remove(pfe);
                            _context.Etudiants.Remove(etudiant);
                            _context.Users.Remove(us);
                            await _context.SaveChangesAsync();
                        }                       
                    }
                }
            }
            return NoContent();
        }

        [Route("AffecterEncadrant")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> AffecterEncadrant(int id, int idEncadrant)
        {
            var pf = _context.PFEs.Include(e => e.Etudiant).Include(e => e.Encadrant).Where(e => e.Id == id).First();
            if (pf == null) return BadRequest();
           /*else if(pf.EncadrantId != null)
            {
                return Ok(new Response { Status = "Error", Message = "Cet étudiant a déjà un encadrant" });
            }*/
            else
            {
                pf.EncadrantId = idEncadrant;
                await _context.SaveChangesAsync();
                return Ok(new Response { Status = "Success", Message = "Affectation réussite!" });
            }
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
        
        public async Task<IActionResult> GererSoutenance(int idPfe, int idEncad1, int idEncad2, string dateStc, string heureDebut, string heureFin)
            {
            var stcIdPfe = _context.Soutenance.Any(s => s.PFEId == idPfe);
          //  var encadprincipal = _context.PFEs.Any(e => e.Id == idPfe && (e.EncadrantId == idEncad1 || e.EncadrantId == idEncad2));
            var encadprincipal = _context.PFEs.Any(e => e.Id == idPfe && (e.EncadrantId == idEncad1 || e.EncadrantId == idEncad2));
            var pfee = _context.PFEs.Any(e => e.Id == idPfe && (e.EncadrantId != idEncad1 || e.EncadrantId != idEncad2));
            
            if (stcIdPfe == false && idEncad1 != idEncad2 && encadprincipal == false)
            {
                var enc1 = _context.Encadrants.Where(e => e.Id.Equals(idEncad1)).First();
                var enc2 = _context.Encadrants.Where(e => e.Id.Equals(idEncad2)).First();
                var enc = _context.PFEs.Include(p => p.Encadrant).Where(e => e.Id == idPfe).First();

                Soutenance soutenance = new Soutenance();

                soutenance.PFEId = idPfe;
                soutenance.Date = dateStc;
                soutenance.HeureDebut = heureDebut;
                soutenance.HeureFin = heureFin;
                List<Encadrant> list = new List<Encadrant>();

                if (_context.Soutenance.Count() == 0)
                {
                    list.Add(enc1);
                    list.Add(enc2);
                    list.Add(enc.Encadrant);
                }
               else
               {
                    var testEncad = _context.Soutenance.Any(s => (s.Jury.Any(j => j.Id == enc.EncadrantId)) && s.Date == dateStc
                                           && s.HeureDebut == heureDebut && s.HeureFin == heureFin);
                    if (testEncad == false)
                    {
                        list.Add(enc.Encadrant);
                    }
                    else
                    {
                        return Ok(new Response { Status = "error", Message = enc.Encadrant.Nom + " " + enc.Encadrant.Prenom + " est déjà affecté à une soutenance " + "le " + dateStc + " à " + heureDebut });
                    }

                    var testEncad1 = _context.Soutenance.Any(s => s.Jury.Any(j => j.Id == idEncad1) && s.Date == dateStc
                                            && s.HeureDebut == heureDebut && s.HeureFin == heureFin);
                    if (testEncad1 == false)
                    {
                     list.Add(enc1);
                    }
                    else
                    {
                        return Ok(new Response { Status = "error", Message = enc1.Nom + " " + enc1.Prenom + " est déjà affecté à une soutenance " + "le " + dateStc +" à " + heureDebut });
                    }


                    var testEncad2 = _context.Soutenance.Any(s => s.Jury.Any(j => j.Id == idEncad2) && s.Date == dateStc
                                            && s.HeureDebut == heureDebut && s.HeureFin == heureFin);
                    if (testEncad2 == false)
                    {
                        list.Add(enc2);
                    }
                    else
                    {
                        return Ok(new Response { Status = "error", Message = enc2.Nom + " " + enc2.Prenom + " est déjà affecté à une soutenance " + "le " + dateStc +" à " + heureDebut });
                    }
               }

                soutenance.Jury = list;

                if (list.Count >= 3)
                {
                    _context.Add(soutenance);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    return Ok(new Response { Status = "error", Message = "Liste invalide" });
                }
                    
                return Ok(new Response { Status = "success", Message = "Soutenance ajoutée avec succès" });
            }
            else if(stcIdPfe == true)
            {
                return Ok(new Response { Status = "error", Message = "Cet étudiant a déjà une soutenance" });
            }
            else if (encadprincipal == true )
            {
                return Ok(new Response { Status = "error", Message = "Les jurys doivent être différents de l'encadrant académique" });
            }
            else if(idEncad1 == idEncad2) {
                return Ok(new Response { Status = "error", Message = "Les jurys doivent être différents" });
            }
            else
            {
                return Ok(new Response { Status = "error", Message = "Soutenance non ajoutée" });
            }
            
        }

        // Get Soutenance par Date 

        [Route("GetSoutenanceByDate")]
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Soutenance>>> GetSoutenanceByDate(string date)
        {
            return await _context.Soutenance.Include(j => j.Jury).Include(e => e.PFE.Etudiant).Include(e => e.PFE.Encadrant).Where(s => s.Date == date).ToListAsync();
        }

        [HttpGet]
        [Route("GetSoutenanceById")]
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Soutenance>>> GetSoutenanceById(int id)
        {
            return await _context.Soutenance.Include(j => j.Jury).Include(e => e.PFE.Etudiant).Include(e => e.PFE.Encadrant).Where(e => e.Id == id).ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [Route("DeleteSoutenance")]
        [HttpDelete]
        public async Task<IActionResult> SupprimerSoutenance(int id)
        {

            //fetching and filter specific member id record   
            //delete from pfe first

            var stc = _context.Soutenance.Where(p => p.Id == id).FirstOrDefault();

            if (stc != null)
            {
                _context.Soutenance.Remove(stc);
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }

        [HttpGet]
        [Route("HasEncadrant")]
        /*[Authorize(Roles = "Admin")]*/
        [AllowAnonymous]
        public bool HasEncadrant(int id)
        {
            var test = _context.PFEs.Where(e => e.Id == id).FirstOrDefault();
            if(test != null)
            {
                if (test.EncadrantId == null)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            return false;
        }




        /////////////////////////////export////////////////
        ///
       /* [HttpGet]
        [Route("UploadFileSoutenance")]
        [AllowAnonymous]
        public IWorkbook ExportFile()
        {
            var newFile = @"newbook.core.xlsx";

            using (var fs = new FileStream(newFile, FileMode.Create, FileAccess.Write)) 
            {

            IWorkbook workbook = new XSSFWorkbook();

            ISheet sheet1 = workbook.CreateSheet("Sheet1");

            sheet1.AddMergedRegion(new CellRangeAddress(0, 0, 0, 10));
            var rowIndex = 0;
            IRow row = sheet1.CreateRow(rowIndex);
            row.Height = 30 * 80;
            row.CreateCell(0).SetCellValue("this is content");
            sheet1.AutoSizeColumn(0);
            rowIndex++;

            var sheet2 = workbook.CreateSheet("Sheet2");
            var style1 = workbook.CreateCellStyle();
            style1.FillForegroundColor = HSSFColor.Blue.Index2;
            style1.FillPattern = FillPattern.SolidForeground;

            var style2 = workbook.CreateCellStyle();
            style2.FillForegroundColor = HSSFColor.Yellow.Index2;
            style2.FillPattern = FillPattern.SolidForeground;

            var cell2 = sheet2.CreateRow(0).CreateCell(0);
            cell2.CellStyle = style1;
            cell2.SetCellValue(0);

            cell2 = sheet2.CreateRow(1).CreateCell(0);
            cell2.CellStyle = style2;
            cell2.SetCellValue(1);

            workbook.Write(fs);
                return workbook;
            }
            //return Ok(new Response { Status = "success", Message = "uploaded" });
        }   */
        ///////////////////////////////////////////////////
    }
}
