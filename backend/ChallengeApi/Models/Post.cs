using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ChallengeApi.Models
{
    
    public class Post
    {
        [Key]
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