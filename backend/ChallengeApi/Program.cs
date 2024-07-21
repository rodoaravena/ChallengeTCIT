using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using PostManager.Models;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("Posts") ?? "Data Source=Posts.db";
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSqlite<PostDb>(connectionString);

builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new OpenApiInfo { Title = "Challenge API", Description = "Manage Post", Version = "v1" });
});

// 1) define a unique string
string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// 2) define allowed domains, in this case "http://example.com" and "*" = all
//    domains, for testing purposes only.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
      policy =>
      {
          //policy.WithOrigins("http://localhost:4200");
          policy.AllowAnyOrigin();
          policy.AllowAnyMethod();
          policy.AllowAnyHeader();

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
app.UseCors(MyAllowSpecificOrigins);

app.MapGet("/posts", async (PostDb db) => await db.Posts.ToListAsync());

app.MapGet("/posts/{id}", async (PostDb db, int id) => await db.Posts.FindAsync(id));

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
