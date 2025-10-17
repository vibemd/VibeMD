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
      description: "Low-level UI primitives for React"
    },
    {
      name: "TipTap",
      version: "3.7.x",
      license: "MIT",
      description: "The headless editor framework for web artisans"
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
      name: "KaTeX",
      version: "0.16.25",
      license: "MIT",
      description: "Fast math typesetting for the web"
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