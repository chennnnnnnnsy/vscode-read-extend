## 1. Project Setup

- [x] 1.1 Initialize VSCode extension project with TypeScript (package.json, tsconfig.json, src/extension.ts)
- [x] 1.2 Add dependencies: epub2, @types/vscode
- [x] 1.3 Configure package.json with extension metadata, activation events, and contributes section (commands, configuration)

## 2. File Import & Parsing

- [x] 2.1 Implement TextParser module: epub parsing using epub2, extracting chapters with titles and plain text content
- [x] 2.2 Implement TextParser module: txt file loading as single "未知章节" chapter
- [x] 2.3 Handle epub files with no chapter structure (fallback to "未知章节")
- [x] 2.4 Add file type validation, reject unsupported formats with error message

## 3. Book Management

- [x] 3.1 Implement BookManager: maintain book list in globalState (add, remove, list, switch)
- [x] 3.2 Register "Import Book" command with file picker dialog (filter epub/txt)
- [x] 3.3 Register "Switch Book" command with QuickPick book list
- [x] 3.4 Register "Remove Book" command with QuickPick selection

## 4. Status Bar Display

- [x] 4.1 Implement StatusBarView: create StatusBarItem, display text substring from current position
- [x] 4.2 Read `readExtend.displayLength` configuration (default 50) and react to config changes
- [x] 4.3 Register "Toggle Visibility" command to show/hide status bar item

## 5. Reading Navigation

- [x] 5.1 Implement ReaderEngine: position tracking (chapter index + character offset)
- [x] 5.2 Register "Next Page" command: advance position by displayLength, handle chapter boundary
- [x] 5.3 Register "Previous Page" command: move back by displayLength, handle chapter boundary

## 6. Chapter Navigation

- [x] 6.1 Register "Go to Chapter" command: show QuickPick with chapter titles
- [x] 6.2 On chapter selection, jump reading position to start of selected chapter

## 7. Text Search

- [x] 7.1 Register "Search" command: show input box, store search keyword
- [x] 7.2 Register "Search Next" command: find next occurrence from current position, jump to it
- [x] 7.3 Register "Search Previous" command: find previous occurrence from current position, jump to it
- [x] 7.4 Show info message when no more matches found in either direction

## 8. Reading Progress Persistence

- [x] 8.1 Save reading position to globalState on every position change
- [x] 8.2 Restore last active book and position on extension activation
- [x] 8.3 Restore position when switching between books

## 9. Commands & Keybindings

- [x] 9.1 Register all commands in package.json contributes.commands
- [x] 9.2 Add default keybindings in package.json contributes.keybindings (optional suggestions)
- [x] 9.3 Verify all commands are accessible via Command Palette

## 10. Testing & Polish

- [ ] 10.1 Test epub import with multi-chapter and no-chapter files
- [ ] 10.2 Test txt import
- [ ] 10.3 Test navigation edge cases (start/end of book, chapter boundaries)
- [ ] 10.4 Test search forward/backward and no-match scenarios
- [ ] 10.5 Test persistence across VSCode restarts
