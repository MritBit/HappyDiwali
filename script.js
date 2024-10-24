// Canvas setup for fireworks
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Background and explosion sounds
const backgroundSound_1 = document.getElementById("background-sound-1");
const backgroundSound_2 = document.getElementById("background-sound-2");
const explosionSound = document.getElementById("explosion-sound");

// Play the background sound immediately when the page loads
backgroundSound_1.volume = 0.5; // Adjust the volume as needed
backgroundSound_1.play().catch((error) => {
  console.log("Background audio play failed: ", error);
});
backgroundSound_2.volume = 0.5; // Adjust the volume as needed
backgroundSound_2.play().catch((error) => {
  console.log("Background audio play failed: ", error);
});

// Firework and particle logic
class Particle {
  constructor(x, y, angle, speed, size, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.size = size;
    this.color = color;
    this.alpha = 1;
    this.gravity = 0.05;
    this.friction = 0.97;
  }

  update() {
    this.speed *= this.friction;
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle) + this.gravity;
    this.alpha -= 0.01;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.exploded = false;
    this.particles = [];
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.explosionPattern = Math.random() > 0.5 ? "burst" : "ring";
    this.explosionPower = Math.random() * 80 + 60;
  }

  launch() {
    this.y -= 4;
    if (this.y <= canvas.height / 2) {
      this.exploded = true;
      this.explode();
    }
  }

  explode() {
    const particleCount = Math.floor(this.explosionPower);
    const angleStep = (Math.PI * 2) / particleCount;

    for (let i = 0; i < particleCount; i++) {
      const angle =
        this.explosionPattern === "burst"
          ? Math.random() * 2 * Math.PI
          : i * angleStep;
      const speed = Math.random() * 6 + 2;
      const size = Math.random() * 3 + 1;
      this.particles.push(
        new Particle(this.x, this.y, angle, speed, size, this.color)
      );
    }

    // Play the explosion sound when the firework explodes
    explosionSound.currentTime = 0; // Reset sound to start
    explosionSound.play().catch((error) => {
      console.log("Explosion audio play failed: ", error);
    });
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + 10);
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
  }
}

// Main animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((rocket, index) => {
    if (!rocket.exploded) {
      rocket.launch();
      rocket.draw();
    } else {
      rocket.particles.forEach((particle, particleIndex) => {
        if (particle.alpha > 0) {
          particle.update();
          particle.draw();
        } else {
          rocket.particles.splice(particleIndex, 1);
        }
      });

      if (rocket.particles.length === 0) {
        rockets.splice(index, 1);
      }
    }
  });

  requestAnimationFrame(animate);
}

// Array to store rockets
let rockets = [];

// Create random fireworks at intervals
setInterval(() => {
  rockets.push(new Firework(Math.random() * canvas.width, canvas.height));
}, 1000);

// Start animation
animate();
