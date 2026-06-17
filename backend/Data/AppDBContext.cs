using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserRegistration> Users => Set<UserRegistration>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRegistration>(entity =>
            {
                entity.HasKey(u => u.userID);

                entity.Property(u => u.userFirstName).IsRequired().HasMaxLength(200);

                entity.Property(u => u.userLastName).IsRequired().HasMaxLength(100);

                entity.Property(u => u.userProfileName).IsRequired().HasMaxLength(100);

                entity.Property(u => u.email).IsRequired().HasMaxLength(200);

                entity.HasIndex(u => u.email).IsUnique();

                entity.Property(u => u.passwordHash).IsRequired();

                entity.HasMany(u => u.RefreshTokens).WithOne(rt => rt.User).HasForeignKey(rt => rt.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<RefreshToken>(entity =>{
                 entity.HasKey(rt=>rt.Id);

                 entity.Property(rt => rt.Token).IsRequired().HasMaxLength(500);

                 entity.HasIndex(rt=>rt.Token).IsUnique();

                 entity.Property(rt=>rt.CreatedAt).HasDefaultValueSql("now()");
                 });
        }

        private static void SeeData(ModelBuilder modelbuilder)
        {
            modelbuilder.Entity<UserRegistration>().HasData(new UserRegistration
            {
                userID = Guid.Parse("11111111 - 1111 - 1111 - 1111 - 111111111111"),
                userFirstName ="Admin",
                userLastName = "User",
                userProfileName ="admin",
                email = "michaeljohnson5880@gmail.com",
                passwordHash= "password"

            });
        }

    }
}