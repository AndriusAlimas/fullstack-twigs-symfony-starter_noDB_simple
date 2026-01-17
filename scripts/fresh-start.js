#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message) {
  console.log(
    `${colors.green}[${new Date().toISOString()}] ${message}${colors.reset}`,
  );
}

function warn(message) {
  console.log(`${colors.yellow}[WARN] ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}[ERROR] ${message}${colors.reset}`);
  process.exit(1);
}

function executeCommand(command, description) {
  try {
    log(description);
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    warn(`Warning: ${command} failed, but continuing...`);
  }
}

function main() {
  console.log(`
${colors.blue}╔══════════════════════════════════════════════════════════════╗
║                   🔄 FRESH START SCRIPT                     ║
║              Complete Clean + Setup                          ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);

  log("Cleaning up everything...");

  // Stop and remove all containers and volumes
  executeCommand(
    "docker-compose down -v --remove-orphans",
    "Stopping and removing containers and volumes...",
  );

  // Remove Docker images
  try {
    log("Checking for project Docker images to remove...");
    const images = execSync("docker images -q twigs*", {
      encoding: "utf-8",
    }).trim();
    if (images) {
      executeCommand(
        `docker rmi -f ${images}`,
        "Removing project Docker images...",
      );
    } else {
      log("No project images to remove");
    }
  } catch (err) {
    warn("Could not remove project images");
  }

  // Clean Docker system
  executeCommand("docker system prune -f", "Cleaning Docker system...");

  // Remove vendor directory if exists
  try {
    const vendorPath = path.join(process.cwd(), "backend", "vendor");
    if (fs.existsSync(vendorPath)) {
      log("Removing vendor directory...");
      fs.rmSync(vendorPath, { recursive: true, force: true });
    }
  } catch (err) {
    warn("Could not remove vendor directory");
  }

  // Remove cache directory if exists
  try {
    const cachePath = path.join(process.cwd(), "backend", "var", "cache");
    if (fs.existsSync(cachePath)) {
      log("Removing cache directory...");
      fs.rmSync(cachePath, { recursive: true, force: true });
    }
  } catch (err) {
    warn("Could not remove cache directory");
  }

  log("Starting fresh setup...");

  // Build and start containers from scratch
  executeCommand(
    "docker-compose build --no-cache",
    "Building Docker containers from scratch...",
  );
  executeCommand("docker-compose up -d", "Starting containers...");

  // Wait a moment for containers to be ready
  log("Waiting for containers to start...");
  try {
    // Simple delay to let containers start
    require("child_process").execSync("ping 127.0.0.1 -n 6 > nul", {
      stdio: "devnull",
    });
  } catch (err) {
    // Continue regardless
  }

  // Install backend dependencies
  log("Installing Symfony dependencies...");
  try {
    execSync("docker-compose exec -T backend composer install", {
      stdio: "inherit",
    });
  } catch (err) {
    try {
      execSync("docker-compose exec backend composer install", {
        stdio: "inherit",
      });
    } catch (err2) {
      warn(
        "Could not install dependencies automatically. You may need to run 'docker-compose exec backend composer install' manually.",
      );
    }
  }

  // Clear cache
  log("Clearing Symfony cache...");
  try {
    execSync("docker-compose exec -T backend php bin/console cache:clear", {
      stdio: "inherit",
    });
  } catch (err) {
    try {
      execSync("docker-compose exec backend php bin/console cache:clear", {
        stdio: "inherit",
      });
    } catch (err2) {
      warn("Could not clear cache automatically.");
    }
  }

  console.log(`
${colors.green}╔══════════════════════════════════════════════════════════════╗
║                    ✅ FRESH START COMPLETE!                  ║
║                                                              ║
║  🌐 Backend:  http://localhost:8000                         ║
║                                                              ║
║  📁 Templates: backend/templates/                           ║
║  🎮 Controllers: backend/src/Controller/                    ║
║                                                              ║
║  Commands:                                                   ║
║  • npm run logs      - View container logs                  ║
║  • npm run down      - Stop containers                      ║
║  • npm run restart   - Restart containers                   ║
║  • npm run cleanup   - Clean up everything                  ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

if (require.main === module) {
  main();
}
