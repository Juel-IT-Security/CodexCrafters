# API Documentation

This document provides comprehensive documentation for the AGENTS.md Educational Platform API endpoints.

## Base URL

All API endpoints are relative to the base URL: `http://localhost:5000/api`

## Examples API

### GET /api/examples

Retrieve all example projects with generated AGENTS.md files.

**Response:**
```json
[
  {
    "id": 1,
    "title": "React E-commerce App",
    "description": "Modern React application with TypeScript, Tailwind CSS, and Stripe integration",
    "projectType": "Frontend Heavy",
    "repositoryStructure": "├── src/\n│   ├── components/\n│   ├── pages/\n│   ├── hooks/\n│   └── utils/\n├── public/\n└── package.json",
    "generatedAgentsMd": "# AGENTS.md\n\n> Conventions for using multi‑agent prompts...",
    "tags": ["React", "TypeScript", "E-commerce", "Stripe", "Frontend"]
  }
]
```

### GET /api/examples/:id

Retrieve a specific example by ID.

**Parameters:**
- `id` (number): Example ID

**Response:**
```json
{
  "id": 1,
  "title": "React E-commerce App",
  "description": "Modern React application with TypeScript, Tailwind CSS, and Stripe integration",
  "projectType": "Frontend Heavy",
  "repositoryStructure": "├── src/\n│   ├── components/\n│   ├── pages/\n│   ├── hooks/\n│   └── utils/\n├── public/\n└── package.json",
  "generatedAgentsMd": "# AGENTS.md\n\n> Conventions for using multi‑agent prompts...",
  "tags": ["React", "TypeScript", "E-commerce", "Stripe", "Frontend"]
}
```

### POST /api/examples

Create a new example project.

**Request Body:**
```json
{
  "title": "Example Project",
  "description": "Project description",
  "projectType": "Full Stack",
  "repositoryStructure": "Repository structure text",
  "generatedAgentsMd": "Generated AGENTS.md content",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Example Project",
  "description": "Project description",
  "projectType": "Full Stack",
  "repositoryStructure": "Repository structure text",
  "generatedAgentsMd": "Generated AGENTS.md content",
  "tags": ["tag1", "tag2"]
}
```

## Guides API

### GET /api/guides

Retrieve all tutorial guides.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Getting Started with AGENTS.md",
    "description": "Learn how to use our GPT bot to generate your first AGENTS.md file and set up multi-agent workflows.",
    "videoUrl": null,
    "thumbnailColor": "from-blue-500 to-blue-700",
    "category": "Getting Started"
  }
]
```

### GET /api/guides/:id

Retrieve a specific guide by ID.

**Parameters:**
- `id` (number): Guide ID

**Response:**
```json
{
  "id": 1,
  "title": "Getting Started with AGENTS.md",
  "description": "Learn how to use our GPT bot to generate your first AGENTS.md file and set up multi-agent workflows.",
  "videoUrl": null,
  "thumbnailColor": "from-blue-500 to-blue-700",
  "category": "Getting Started"
}
```

### POST /api/guides

Create a new tutorial guide.

**Request Body:**
```json
{
  "title": "Guide Title",
  "description": "Guide description",
  "videoUrl": "https://youtube.com/watch?v=example",
  "thumbnailColor": "from-green-500 to-green-700",
  "category": "Advanced"
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Guide Title",
  "description": "Guide description",
  "videoUrl": "https://youtube.com/watch?v=example",
  "thumbnailColor": "from-green-500 to-green-700",
  "category": "Advanced"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Data Types

### Example
- `id`: number (auto-generated)
- `title`: string (required)
- `description`: string (required)
- `projectType`: string (required)
- `repositoryStructure`: string (required)
- `generatedAgentsMd`: string (required)
- `tags`: string[] (optional, defaults to empty array)

### Guide
- `id`: number (auto-generated)
- `title`: string (required)
- `description`: string (required)
- `videoUrl`: string (optional)
- `thumbnailColor`: string (required)
- `category`: string (required)

## Authentication

Currently, this API does not require authentication. All endpoints are publicly accessible.

## Rate Limiting

No rate limiting is currently implemented.

## CORS

CORS is enabled for all origins in development mode.