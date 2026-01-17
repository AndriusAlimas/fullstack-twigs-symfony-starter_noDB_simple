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
    error(`Failed to execute: ${command}`);
  }
}

function checkDocker() {
  try {
    execSync("docker info", { stdio: "devnull" });
    log("✓ Docker is installed and running");
  } catch (err) {
    error("Docker is not running. Please start Docker first.");
  }
}

function checkDockerCompose() {
  try {
    execSync("docker-compose --version", { stdio: "devnull" });
    log("✓ Docker Compose is available");
  } catch (err) {
    error("Docker Compose is not installed or not in PATH.");
  }
}

function main() {
  console.log(`
${colors.blue}╔══════════════════════════════════════════════════════════════╗
║                    🚀 TWIG + SYMFONY STARTER                ║
║                        Setup Script                          ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);

  // Check prerequisites
  log("Checking prerequisites...");
  checkDocker();
  checkDockerCompose();

  // Stop any existing containers
  log("Stopping any existing containers...");
  try {
    execSync("docker-compose down", { stdio: "inherit" });
  } catch (err) {
    warn("No existing containers to stop");
  }

  // Build and start containers
  executeCommand(
    "docker-compose build --no-cache",
    "Building Docker containers...",
  );
  executeCommand("docker-compose up -d", "Starting containers...");

  // Install backend dependencies
  log("Installing Symfony dependencies...");
  try {
    execSync("docker-compose exec -T backend composer install", {
      stdio: "inherit",
    });
  } catch (err) {
    warn(
      "Could not install dependencies automatically. Trying without -T flag...",
    );
    try {
      execSync("docker-compose exec backend composer install", {
        stdio: "inherit",
      });
    } catch (err2) {
      warn(
        "Could not install dependencies. You may need to run 'docker-compose exec backend composer install' manually.",
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
    warn("Could not clear cache automatically.");
  }

  console.log(`
${colors.green}╔══════════════════════════════════════════════════════════════╗
║                    ✅ SETUP COMPLETE!                        ║
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
