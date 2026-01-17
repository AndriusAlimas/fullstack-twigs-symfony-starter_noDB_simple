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
${colors.blue}╔══════════════════════════════════════════════════════════════╗
║                    🔄 RESTART CONTAINERS                    ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);

  executeCommand("docker-compose down", "Stopping containers...");
  executeCommand("docker-compose up -d", "Starting containers...");
  
  // Clear cache
  setTimeout(() => {
    executeCommand("docker-compose exec -T backend php bin/console cache:clear", "Clearing cache...");
  }, 3000);

  console.log(`
${colors.green}╔══════════════════════════════════════════════════════════════╗
║                   ✅ RESTART COMPLETE!                      ║
║                                                              ║
║  🌐 Application: http://localhost:8000                      ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

if (require.main === module) {
  main();
}