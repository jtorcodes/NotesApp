using Microsoft.EntityFrameworkCore;
using NotesApp.Data;
using NotesApp.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<NotesDbContext>(options =>
    options.UseSqlite("Data Source=notes.db"));

var app = builder.Build();

app.UseCors();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NotesDbContext>();
    db.Database.EnsureCreated();
}

app.MapPost("/notes", async (Note note, NotesDbContext db) =>
{
    db.Notes.Add(note);
    await db.SaveChangesAsync();
    return Results.Created($"/notes/{note.Id}", note);
});

app.MapGet("/notes", async (NotesDbContext db) =>
    await db.Notes.OrderByDescending(n => n.CreatedAt).ToListAsync()
);

app.MapPut("/notes/{id}", async (int id, Note input, NotesDbContext db) =>
{
    var note = await db.Notes.FindAsync(id);
    if (note is null) return Results.NotFound();

    note.Title = input.Title;
    note.Content = input.Content;

    await db.SaveChangesAsync();
    return Results.Ok(note);
});

app.MapDelete("/notes/{id}", async (int id, NotesDbContext db) =>
{
    var note = await db.Notes.FindAsync(id);
    if (note is null) return Results.NotFound();

    db.Notes.Remove(note);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
