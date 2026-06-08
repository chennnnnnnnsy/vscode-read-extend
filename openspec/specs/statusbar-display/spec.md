## ADDED Requirements

### Requirement: Display text in status bar
The system SHALL display the current reading content as plain text in the VSCode status bar (bottom bar where git branch is shown).

#### Scenario: Show current reading content
- **WHEN** a book is loaded and the reader is visible
- **THEN** the status bar item displays a substring of the current chapter's text starting from the current reading position, with length equal to the configured character count

### Requirement: Configurable display character count
The system SHALL provide a configuration option `readExtend.displayLength` to set the number of characters displayed at once. The default value SHALL be 50.

#### Scenario: User changes display length
- **WHEN** user sets `readExtend.displayLength` to 80 in VSCode settings
- **THEN** the status bar displays 80 characters of text from the current position

### Requirement: Toggle visibility
The system SHALL provide a command to toggle the visibility of the status bar reading content. This command SHALL be exposed for keybinding.

#### Scenario: Hide reading content
- **WHEN** user executes the "Toggle Visibility" command while content is visible
- **THEN** the status bar item is hidden

#### Scenario: Show reading content
- **WHEN** user executes the "Toggle Visibility" command while content is hidden
- **THEN** the status bar item becomes visible showing the current reading position content

### Requirement: Navigate forward and backward
The system SHALL provide commands to move the reading position forward or backward by the configured display length. These commands SHALL be exposed for keybinding.

#### Scenario: Read next page
- **WHEN** user executes the "Next Page" command
- **THEN** the reading position advances by the configured display length and the status bar updates

#### Scenario: Read previous page
- **WHEN** user executes the "Previous Page" command
- **THEN** the reading position moves back by the configured display length and the status bar updates

#### Scenario: Reach end of chapter
- **WHEN** user executes "Next Page" and the current position is at the end of the current chapter
- **THEN** the system advances to the beginning of the next chapter, or shows a message if it's the last chapter
