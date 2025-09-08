# Electron Operations App

## Overview
The Electron Operations App is a desktop application built with Electron that allows users to manage operations. Users can add operations with details such as importer name, operation number, and estimated arrival date. The application also provides functionality to delete operations, ensuring that all data persists even after the application is closed.

## Features
- Add new operations with importer name, operation number, and estimated arrival date.
- Delete existing operations.
- Data persistence using local storage, ensuring that operations are saved and loaded on application start.

## Project Structure
```
electron-operations-app
├── src
│   ├── main.js          # Main entry point of the application
│   ├── preload.js       # Exposes safe APIs to the renderer process
│   ├── renderer.js      # Handles user interface logic
│   ├── storage.js       # Manages data persistence
│   ├── index.html       # Main HTML file for the application
│   └── types
│       └── index.d.ts   # TypeScript type definitions
├── forge.config.js      # Configuration for Electron Forge
├── package.json         # npm configuration file
└── README.md            # Documentation for the project
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd electron-operations-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

## Usage
- Upon launching the application, users can input the details of an operation in the provided fields.
- Click the "Add Operation" button to save the operation.
- To delete an operation, select it from the list and click the "Delete" button.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.