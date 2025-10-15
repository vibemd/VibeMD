# VibeMD

VibeMD is a simple desktop markdown editor for use across Windows, macOS and Linux. The app:

- provides both plain text markdown editing with side-by-side synchronous preview and WYSIWYG inline editing;
- leverages underlying operating system services for file management (document storage, opening/closing files dialogs, print services);
- provides a templating capability where markdown files may be created by the user and re-used as templates to provide scaffolding for structuring markdown documents more quickly, and;
- provides full support for Commonmark (Phase 1), GFM (Phase 2) and (via toggle on/off in settings) LaTex notation elements (Phase 3).

<br>

## User interface

The main app window will consist of four main areas:

- Top toolbar displaying buttons for:
    - Left side:
        - New: Creating a new markdown file ‘from scratch’
        - Open: Opening an existing markdown files from the filesystem by invoking the operating system file open dialog
        - Save: Save changes to the markdown file being edited, or if the file is new and unsaved, invoking the operating system file save dialog to allow the user to specify a location to save the file
        - Save As: Invoking the operating system file save dialog to allow the user to save the open file into a new location and or with a new file name
    - Right side:
        - Print: Invoking the operating system print dialog enabling the user to print the document
        - Settings: Open a popup window to allow the user to modify settings for use in the app (refer below for details of the settings to be included)

- Left sidebar, containing three tabs accessible from the top of the sidebar:
    - Files: Vertical tabs listing of all of the open markdown files the user is editing (user can move between multiple open files) - The tab for the document in-focus in the editor window should always have focus in the files list. When the app is first open, the files list should be empty and the editor window displays buttons
        - ‘New’ to create a new file
        - ‘Open’ to open an existing file from the filesystem and,
        - ‘Use template’ which should then change the focus of the sidebar to display the Templates tab so the user can select a template to use
    - Outline: Using Headings 1 to 6 in the markdown document in focus to generate a collapsable outline view of the document and allowing the user to click on elements in the outline to move the editor window to that section of the document
    - Templates: List of all the markdown templates created/available for use by the user to scaffold new markdown documents (refer to below for details of templates)
- Editor window - The main window of the app on the right side displaying one of the three editor window types visible at any time for the in-focus markdown document being edited/displayed:
    - WYSIWYG: Inline editing of the in-focus markdown document with full WYSIWYG formatting toolbar provided by Milkdown Crepe
    - Split: Plain text editing window on left with synchronous display and scrolling of 'pretty' (HTML) format on the right using react-markdown, no formatting toolbar displayed
    - Preview: Display the in-focus document in HTML rendering with no editing using react-markdown
- Status bar at the bottom displaying:
    - left side: real-time updating of character and word count for teh in-focus markdown document, and
    - right side: last date/time the in-focus document was saved (if hte document has not yet been saved, display ‘New document not yet saved’

<br>

## Templates

- Templates to be saved in markdown file format but with a file extension of ‘.vibe’ to differentiate them from standard markdown files
- When the app is open, a list of all available templates should be populated into the ‘Templates’ tab of the sidebar drawn from all .vibe files found in the template storage location (as defined in Settings by the user, refer below)
- Each template listed should be accompanied by a ‘Use’ button in the templates list, allowing the user to click and create a new document in the Files list using the template selected as a base - If the user elects to do so, a new file should be opened in the editor, the sidebar should make the Files list visible and the new document should be highlighted in the files list
- When the templates list is visible in the sidebar, clicking on a template (not the ‘Use’ button) should display the template document in the editor window - If the user attempts to modify a template (ie. a document with a .vibe extension) and clicks ‘Save’, they should be warned with a popup that they are updating a template and do they want to proceed with ‘Yes’ (save the changes to the template) or ‘No’ (create a new markdown file in the Files list using the template with the changes that the user has made but do not save or change the .vibe template

<br>

## Settings

The Settings dialog is accessed via the Settings button in the top toolbar. It should display a popup with vertical tabs to the left and in the space to the right (for each tab below):

- General tab, with settings for:
    - Language: Dropdown list to allow the user to specify a language for all UI displays to change between different languages (default English, others to be implemented at a later time)
    - Autosave: Tickbox to force autosaving of open markdown documents (not templates) to be applied only to files that are already saved in the filesystem
    - Autosave interval: Dropdown list allowing the user to specify the intervals for autosaving if set, selecting from 5 minutes, 15 minutes, 30 minutes
- Theme tab, with settings for:
    - Radio buttons to select from Light, Dark or System
- Files tab:
    - Default file extension: Dropdown list to specify what the default file format for new files should be, selecting from ‘md’ or ‘markdown’ for markdown documents or ‘txt’ to default to plain text as teh default format
    - Documents storage location: text box with a Browse button to enable the user to specify a default location in the file system where markdown documents should be save - The default should be set to the default operating system documents location for the user - The user should be able type in the box or use the Browse button to invoke the operating system file system dialog to select a location
    - Templates storage location: as for the documents storage location but to specify where all templates (with .vibe extension) should be stored
- Editor tab:
    - Font size: Dropdown to select a font size from 8-24pt as the default for Normal (or Paragraph) and plain text across the WYSIWYG, Split and Preview editor views
    - Word Wrap: Checkbox to apply wordwrapping for components like code blocks that may usually continue off the screen in WYSIWYG, Split and Preview editor modes, where not ticked, any element in the document that is wider than the window should have a horizontal scroll bar under the element
    - Show Line Numbers: Display line numbers in on the left in the Split view plain text editor
    - LaTeX support: Tickbox to activate LaTeX support in the app
- About tab:
    - Display the name and version (default to 1.0.0) of the app, the website (www.vibemd.app), and
    - a scroll box listing each of the 3rd party components used in the app and Copywright and the licence under which the component is used

<br>

## Other considerations

- Use icon.svg to generate favicons, app icons, etc
- WYSIWYG editor to use Milkdown Crepe with built-in extensible toolbar
- Split view to use CodeMirror for plain text editing and react-markdown for HTML rendering, Preview view to use react-markdown
- App to be built with Electron Forge for Desktop (do not use Vite) from start with Capacitor planned for Mobile
- Use ShadCN for display components