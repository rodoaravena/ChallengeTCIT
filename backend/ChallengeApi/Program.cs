using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using PostManager.Models;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("Posts") ?? "Data Source=Posts.db";
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSqlite<PostDb>(connectionString);



builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new OpenApiInfo { Title = "Challenge API", Description = "Manage Post", Version = "v1" });
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


app.MapGet("/", () => "Hello World!");

app.MapGet("/posts", async (PostDb db) => await db.Posts.ToListAsync());
app.MapPost("/posts", async (PostDb db, Post post) => {
    await db.Posts.AddAsync(post);
    await db.SaveChangesAsync();
    return Results.Created($"/post/{post.Id}", post);
});
app.MapGet("/posts/{id}", async (PostDb db, int id) => await db.Posts.FindAsync(id));

app.MapPut("/post/{id}", async (PostDb db, Post updatepost, int id) =>
{
      var post = await db.Posts.FindAsync(id);
      if (post is null) return Results.NotFound();
      post.Name = updatepost.Name;
      post.Description = updatepost.Description;
      await db.SaveChangesAsync();
      return Results.NoContent();
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
