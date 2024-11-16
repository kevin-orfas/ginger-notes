# Node.js CLI Note-Taking App

A command-line note-taking application built with Node.js that allows you to create, search, and manage notes with tags.

## Features

- Create new notes with optional tags
- List all notes
- Search notes by content
- Remove individual notes
- Clear all notes
- Web interface to view notes

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nodejs-workshop
```

2. Install dependencies:

```bash
npm install
```

3. Install the CLI tool globally:

```bash
npm install -g .
```

This will make the `note` command available globally on your system.

## Usage

### Creating Notes

Create a new note:

```bash
note new "Your note content here"
```

Create a note with tags:

```bash
note new "Your note content here" --tags="personal,todo,important"
```

### Viewing Notes

List all notes:

```bash
note all
```

Search notes by content:

```bash
note find "search term"
```

### Managing Notes

Remove a specific note by ID:

```bash
note remove <note-id>
```

Remove all notes:

```bash
note clean
```

### Web Interface

Launch the web interface to view notes:

```bash
note web
```

Optional: Specify a custom port (default is 5000):

```bash
note web 3000
```

## Project Structure

```
nodejs-workshop/
├── index.js          # CLI entry point
├── package.json      # Project configuration
├── db.json          # JSON database file
└── src/
    ├── command.mjs   # Command definitions
    ├── db.mjs       # Database operations
    ├── notes.mjs    # Note management logic
    ├── server.mjs   # Web interface server
    └── utils.mjs    # Utility functions
```

## Dependencies

- `yargs`: Command-line argument parsing
- `open`: Opening web URLs
- Development:
  - `jest`: Testing framework
  - `nodemon`: Development server with auto-reload

## Scripts

- `npm test`: Run tests
- `npm start`: Start development server with nodemon

## Technical Details

- Uses ES Modules (`type: "module"` in package.json)
- Data is stored in a local JSON file
- Notes are identified by timestamps
- Supports tagging system for organization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
