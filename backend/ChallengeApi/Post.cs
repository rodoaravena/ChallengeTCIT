using Microsoft.EntityFrameworkCore;

namespace PostManager.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }

    }

    class PostDb : DbContext
    {
        public PostDb(DbContextOptions options) : base(options) { }
        public DbSet<Post> Posts { get; set; } = null!;
    }
}