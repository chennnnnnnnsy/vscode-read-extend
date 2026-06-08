## ADDED Requirements

### Requirement: Persist reading position
The system SHALL save the current reading position (character offset and chapter index) for each book when the position changes. The position SHALL be stored using VSCode's globalState API.

#### Scenario: Position saved on navigation
- **WHEN** user navigates to a new position (next page, previous page, chapter jump, or search jump)
- **THEN** the system persists the new position to globalState

### Requirement: Restore reading position
The system SHALL restore the last saved reading position when a book is loaded or switched to.

#### Scenario: Reopen VSCode
- **WHEN** user reopens VSCode after previously reading a book
- **THEN** the system restores the last active book and its reading position, displaying the correct content in the status bar

#### Scenario: Switch between books
- **WHEN** user switches from Book A to Book B and later back to Book A
- **THEN** Book A's reading position is restored to where the user left off
