#!/usr/bin/env node

const { execSync } = require("child_process");

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
    `${colors.green}[${new Date().toISOString()}] ${message}${colors.reset}`
  );
}

function executeCommand(command, description) {
  try {
    log(description);
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    console.log(`${colors.yellow}[WARN] ${description} failed${colors.reset}`);
  }
}

function main() {
  console.log(`
${colors.red}╔══════════════════════════════════════════════════════════════╗
║                    🧹 CLEANUP SCRIPT                        ║
║                 Remove Everything                            ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);

  log("Starting complete cleanup...");

  // Stop containers
  executeCommand("docker-compose down -v", "Stopping and removing containers...");

  // Remove images
  try {
    const images = execSync("docker images -q twigs*", { encoding: "utf-8" }).trim();
    if (images) {
      executeCommand(`docker rmi ${images}`, "Removing Docker images...");
    }
  } catch (err) {
    // Ignore error
  }

  // Clean Docker system
  executeCommand("docker system prune -f", "Cleaning Docker system...");

  // Remove directories
  executeCommand("rm -rf backend/vendor", "Removing vendor directory...");
  executeCommand("rm -rf backend/var/cache", "Removing cache...");
  executeCommand("rm -rf backend/var/log", "Removing logs...");

  console.log(`
${colors.green}╔══════════════════════════════════════════════════════════════╗
║                   ✅ CLEANUP COMPLETE!                      ║
║                                                              ║
║  All containers, images, and caches removed.                ║
║  Run 'npm run setup' to start fresh.                        ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

if (require.main === module) {
  main();
}