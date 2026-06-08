## ADDED Requirements

### Requirement: Search text
The system SHALL provide a command to input a search keyword for the current book. This command SHALL be exposed for keybinding.

#### Scenario: Enter search keyword
- **WHEN** user executes the "Search" command
- **THEN** the system prompts an input box for the user to enter a search keyword

### Requirement: Navigate to next match
The system SHALL provide a command to jump the reading position to the next occurrence of the search keyword from the current position. This command SHALL be exposed for keybinding.

#### Scenario: Find next match
- **WHEN** user executes the "Search Next" command with an active search keyword
- **THEN** the reading position jumps to the next occurrence of the keyword after the current position and the status bar updates

#### Scenario: No more matches forward
- **WHEN** user executes "Search Next" and there are no more occurrences after the current position
- **THEN** the system displays a message indicating no more matches found

### Requirement: Navigate to previous match
The system SHALL provide a command to jump the reading position to the previous occurrence of the search keyword from the current position. This command SHALL be exposed for keybinding.

#### Scenario: Find previous match
- **WHEN** user executes the "Search Previous" command with an active search keyword
- **THEN** the reading position jumps to the previous occurrence of the keyword before the current position and the status bar updates

#### Scenario: No more matches backward
- **WHEN** user executes "Search Previous" and there are no more occurrences before the current position
- **THEN** the system displays a message indicating no more matches found
