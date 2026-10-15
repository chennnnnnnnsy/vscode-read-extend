## ADDED Requirements

### Requirement: List chapters
The system SHALL provide a command to display all chapters of the current book in a QuickPick list. This command SHALL be exposed for keybinding.

#### Scenario: Show chapter list
- **WHEN** user executes the "Go to Chapter" command
- **THEN** the system displays a QuickPick with all chapter titles of the current book

#### Scenario: Default to current chapter
- **WHEN** user opens the chapter QuickPick while reading a book
- **THEN** the currently reading chapter is the active (highlighted) item in the list

### Requirement: Jump to chapter
The system SHALL allow the user to select a chapter from the list and jump the reading position to the beginning of that chapter.

#### Scenario: Select a chapter
- **WHEN** user selects a chapter from the chapter QuickPick list
- **THEN** the reading position jumps to the start of the selected chapter and the status bar updates

### Requirement: Default chapter for unstructured content
When a book has no recognizable chapter structure, the system SHALL present all content under a single chapter titled "未知章节".

#### Scenario: Book with no chapters
- **WHEN** user executes "Go to Chapter" for a txt file or an epub without chapters
- **THEN** the QuickPick shows a single entry "未知章节"
