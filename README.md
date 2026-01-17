# 🚀 Fullstack Twig + Symfony Starter (No Database, Simple)

A **minimal** full-stack starter template with **Symfony 6** and **Twig templates**. Perfect for simple web applications that don't need database complexity.

## ✨ Features

- 🏗️ **Symfony 6.4** - Modern PHP framework
- 🎨 **Twig Templates** - Powerful templating engine
- 🐳 **Docker** - Containerized development environment
- ⚡ **No Database** - Simple, lightweight setup
- 🔧 **One-Command Setup** - Ready in seconds
- 🎯 **Minimal** - Just one page with "Welcome"

## 🚫 What's NOT Included

- ❌ **No Database** - No MySQL, PostgreSQL, or Doctrine ORM
- ❌ **No API endpoints** - Pure web application with Twig templates
- ❌ **No Frontend framework** - Server-side rendered templates
- ❌ **No Complex Features** - Just a simple welcome page

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js (for automation scripts)

### Setup & Run

```bash
# Clone the project
git clone <your-repo-url>
cd fullstack-twigs-symfony-starter_noDB_simple

# One command setup
npm run fresh-start
```

**Your application will be available at: http://localhost:8000**

## 📋 Available Commands

### After PC Restart - Quick Start

```bash
npm start           # Simple start (fastest)
npm run setup       # Full setup if needed
npm run fresh-start # Complete clean + setup
```

### Development Commands

```bash
npm run dev         # Alias for setup
npm run restart     # Restart containers
npm run logs        # View container logs

# Docker Management
npm run build       # Build Docker images
npm run up          # Start containers
npm run down         # Stop containers
npm run cleanup      # Remove everything
```

## 📁 Project Structure

```
fullstack-twigs-symfony-starter_noDB_simple/
├── backend/                    # Symfony Application
│   ├── src/
│   │   ├── Controller/
│   │   │   └── HomeController.php  # Single controller with one route
│   │   └── Kernel.php             # Application Kernel
│   ├── templates/
│   │   ├── base.html.twig        # Base HTML layout
│   │   └── home/
│   │       └── index.html.twig   # Welcome page template
│   ├── config/                   # Symfony Configuration
│   ├── public/                   # Web root
│   └── composer.json            # PHP Dependencies
├── docker/                      # Docker Configuration
├── scripts/                     # Automation Scripts
├── docker-compose.yml           # Docker services
└── package.json                # Scripts and metadata
```

## 🎯 What You Get

**Single Page Application:**

- **URL**: `http://localhost:8000`
- **Content**: Simple "Welcome" page
- **Template**: Clean HTML with title and h1
- **Controller**: One route (`/`) in `HomeController`

## 🔧 Development

### Customizing the Welcome Page

Edit `backend/templates/home/index.html.twig`:

```twig
{% extends 'base.html.twig' %}

{% block title %}Your Title{% endblock %}

{% block body %}
    <h1>Your Content</h1>
{% endblock %}
```

### Adding More Pages

1. Add new routes to `backend/src/Controller/HomeController.php`:

```php
#[Route('/about', name: 'app_about')]
public function about(): Response
{
    return $this->render('home/about.html.twig');
}
```

2. Create corresponding template in `backend/templates/home/`

### Customizing Styles

- Edit CSS in `backend/templates/base.html.twig`
- Base template includes responsive styling

## 🎯 Use Cases

Perfect for:

- 📝 **Simple websites** that need just basic pages
- 🎨 **Portfolio landing pages**
- 📋 **Single page applications**
- 🔧 **Quick prototypes**
- 📚 **Learning Symfony** basics
- 🎪 **Minimal demos**

## 🆘 Troubleshooting

### After PC Restart

```bash
# Try these commands in order:
npm start           # Quick start (if containers exist)
npm run setup       # Full setup (if issues)
npm run fresh-start # Complete reset (if broken)
```

### Common Issues

```bash
# View logs
npm run logs

# Clear Symfony cache
docker-compose exec backend php bin/console cache:clear

# Complete reset
npm run fresh-start
```

### Port Conflicts

If port 8000 is in use, modify `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8080:8000" # Change to available port
```

---

**Happy Coding! 🎉**

_Simple. Clean. Ready to use._
