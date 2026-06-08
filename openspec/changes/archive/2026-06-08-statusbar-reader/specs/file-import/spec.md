## ADDED Requirements

### Requirement: Import epub file
The system SHALL allow users to select and import local epub files via a file picker dialog. The epub file SHALL be parsed into plain text with chapter structure preserved.

#### Scenario: Successfully import an epub file
- **WHEN** user executes the "Import Book" command and selects a valid epub file
- **THEN** the system parses the epub into chapters with titles and plain text content, adds the book to the book list, and sets it as the current book

#### Scenario: Import an epub with no chapter structure
- **WHEN** user imports an epub file that has no recognizable chapter divisions
- **THEN** the system wraps all content under a single chapter titled "未知章节"

### Requirement: Import txt file
The system SHALL allow users to select and import local txt files. The txt file content SHALL be loaded as a single chapter titled "未知章节".

#### Scenario: Successfully import a txt file
- **WHEN** user executes the "Import Book" command and selects a valid txt file
- **THEN** the system loads the text content as one chapter titled "未知章节", adds the book to the book list, and sets it as the current book

### Requirement: Manage multiple books
The system SHALL maintain a list of imported books and allow the user to switch between them.

#### Scenario: Switch current book
- **WHEN** user executes the "Switch Book" command
- **THEN** the system displays a QuickPick list of all imported books, and upon selection, switches to that book restoring its last reading position

#### Scenario: Remove a book
- **WHEN** user executes the "Remove Book" command and selects a book
- **THEN** the system removes the book from the list and clears its saved reading position

### Requirement: File format extensibility
The system SHALL convert all imported file formats to plain text internally. Adding support for new file types in the future SHALL only require implementing a new parser that outputs the same Chapter structure.

#### Scenario: Unsupported file type selected
- **WHEN** user selects a file with an unsupported extension
- **THEN** the system displays an error message indicating the file format is not supported
