export function AboutTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">About VibeMD</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Version</h4>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">
              A cross-platform desktop markdown editor with WYSIWYG editing, 
              template system, and native OS integration.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">Built with</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Electron Forge</li>
              <li>React 18</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>ShadCN/ui</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}