using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using ChallengeApi.Models;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("postgresCS");

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddNpgsql<PostDb>(connectionString);

builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new OpenApiInfo { Title = "Challenge API", Description = "Manage Post", Version = "v1" });
});

// Configuración del CORS
string TCITAllowedCORS = "_SpecificOrigins";


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: TCITAllowedCORS,
      policy =>
      {
          policy.WithOrigins("http://localhost:4200")// Se establece desde donde se recibirán las peticiones
          .WithMethods("GET","POST", "DELETE") // Se establece los metodos permitidos
          .AllowAnyHeader();
      });
   
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
   app.UseSwagger();
   app.UseSwaggerUI(c =>
   {
      c.SwaggerEndpoint("/swagger/v1/swagger.json", "Challenge API V1");
   });
}


// 3) use the capability
app.UseCors(TCITAllowedCORS);

app.MapGet("/posts", async (PostDb db) => await db.Posts.ToListAsync());

app.MapPost("/posts", async (PostDb db, Post post) => {
    await db.Posts.AddAsync(post);
    await db.SaveChangesAsync();
    return Results.Created($"/post/{post.Id}", post);
});

app.MapDelete("/post/{id}", async (PostDb db, int id) =>
{
   var post = await db.Posts.FindAsync(id);
   if (post is null)
   {
      return Results.NotFound();
   }
   db.Posts.Remove(post);
   await db.SaveChangesAsync();
   return Results.Ok();
});

app.Run();
