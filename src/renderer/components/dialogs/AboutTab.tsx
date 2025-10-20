export function AboutTab() {
  const thirdPartyComponents = [
    {
      name: "Electron",
      version: "38.2.2",
      license: "MIT",
      description: "Build cross-platform desktop apps with JavaScript, HTML, and CSS"
    },
    {
      name: "React",
      version: "19.2.0",
      license: "MIT",
      description: "A JavaScript library for building user interfaces"
    },
    {
      name: "React DOM",
      version: "19.2.0",
      license: "MIT",
      description: "React package for working with the DOM"
    },
    {
      name: "TypeScript",
      version: "4.5.4",
      license: "Apache-2.0",
      description: "JavaScript with syntax for types"
    },
    {
      name: "Tailwind CSS",
      version: "3.4.18",
      license: "MIT",
      description: "A utility-first CSS framework"
    },
    {
      name: "Radix UI",
      version: "Various",
      license: "MIT",
      description: "Low-level UI primitives for React (Checkbox, Dialog, Dropdown Menu, Label, Radio Group, Select, Separator, Slot, Tabs, Toggle Group, Tooltip)"
    },
    {
      name: "TipTap",
      version: "3.7.1",
      license: "MIT",
      description: "The headless editor framework for web artisans (includes Starter Kit and extensions for Hard Break, Horizontal Rule, Image, Link, Subscript, Superscript, Table, Task List)"
    },
    {
      name: "Zustand",
      version: "5.0.8",
      license: "MIT",
      description: "A small, fast and scalable bearbones state-management solution"
    },
    {
      name: "Lucide React",
      version: "0.545.0",
      license: "ISC",
      description: "Beautiful & consistent icon toolkit made by the community"
    },
    {
      name: "Marked",
      version: "16.4.0",
      license: "MIT",
      description: "A markdown parser and compiler"
    },
    {
      name: "Turndown",
      version: "7.2.1",
      license: "MIT",
      description: "HTML to Markdown converter"
    },
    {
      name: "KaTeX",
      version: "0.16.25",
      license: "MIT",
      description: "Fast math typesetting for the web"
    },
    {
      name: "React Markdown",
      version: "10.1.0",
      license: "MIT",
      description: "React component to render markdown"
    },
    {
      name: "Rehype KaTeX",
      version: "7.0.1",
      license: "MIT",
      description: "Plugin to transform HTML with KaTeX"
    },
    {
      name: "Remark",
      version: "15.0.1",
      license: "MIT",
      description: "Markdown processor powered by plugins"
    },
    {
      name: "Remark Parse",
      version: "11.0.0",
      license: "MIT",
      description: "Remark plugin to parse markdown"
    },
    {
      name: "Remark GFM",
      version: "4.0.1",
      license: "MIT",
      description: "GitHub Flavored Markdown support for Remark"
    },
    {
      name: "Remark Math",
      version: "6.0.0",
      license: "MIT",
      description: "Math support for Remark"
    },
    {
      name: "Unified",
      version: "11.0.5",
      license: "MIT",
      description: "Interface for parsing, transforming, and compiling content"
    },
    {
      name: "MDast Util To String",
      version: "4.0.0",
      license: "MIT",
      description: "Utility to get the plain text content of a node"
    },
    {
      name: "Unist Util Visit",
      version: "5.0.0",
      license: "MIT",
      description: "Utility to visit nodes in a unist tree"
    },
    {
      name: "Class Variance Authority",
      version: "0.7.1",
      license: "MIT",
      description: "Utility for creating variant-based component APIs"
    },
    {
      name: "CLSX",
      version: "2.1.1",
      license: "MIT",
      description: "Utility for constructing className strings conditionally"
    },
    {
      name: "Tailwind Merge",
      version: "3.3.1",
      license: "MIT",
      description: "Utility to merge Tailwind CSS classes without style conflicts"
    },
    {
      name: "Date-fns",
      version: "4.1.0",
      license: "MIT",
      description: "Modern JavaScript date utility library"
    },
    {
      name: "UUID",
      version: "13.0.0",
      license: "MIT",
      description: "RFC4122 UUID generator"
    },
    {
      name: "Zod",
      version: "4.1.12",
      license: "MIT",
      description: "TypeScript-first schema validation library"
    },
    {
      name: "Autoprefixer",
      version: "10.4.21",
      license: "MIT",
      description: "PostCSS plugin to parse CSS and add vendor prefixes"
    },
    {
      name: "PostCSS",
      version: "8.5.6",
      license: "MIT",
      description: "Tool for transforming CSS with JavaScript"
    },
    {
      name: "Electron Squirrel Startup",
      version: "1.0.1",
      license: "Apache-2.0",
      description: "Default Squirrel.Windows event handler for Electron apps"
    },
    {
      name: "Electron Forge",
      version: "7.10.2",
      license: "MIT",
      description: "A complete tool for creating, publishing, and installing modern Electron applications"
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">About VibeMD</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Version</h4>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          
          <div>
            <h4 className="font-medium">License</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                VibeMD is released under the MIT License. This means you are free to use, 
                modify, distribute, and sell this software, including for commercial purposes, 
                as long as you include the original copyright notice and license text.
              </p>
              <p>
                The MIT License is a permissive free software license that places minimal 
                restrictions on how the software can be used, modified, and distributed.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium">Third-Party Components</h4>
            <p className="text-xs text-muted-foreground mb-3">
              This application uses open-source components. Full license texts are available 
              in the application's documentation or can be obtained from the respective projects.
            </p>
            <div className="h-32 overflow-y-auto border rounded-md p-3 bg-muted/50">
              <div className="space-y-3">
                {thirdPartyComponents.map((component, index) => (
                  <div key={index} className="border-b border-border/50 pb-2 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{component.name}</span>
                      <span className="text-xs text-muted-foreground">{component.version}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{component.description}</p>
                    <p className="text-xs font-medium">License: {component.license}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}