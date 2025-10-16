import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export interface OutlineNode {
  depth: number;
  text: string;
  line: number;
  children?: OutlineNode[];
  id?: string; // Unique identifier for navigation
}

export class MarkdownService {
  countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  countCharacters(text: string): number {
    return text.length;
  }

  generateOutline(markdown: string): OutlineNode[] {
    try {
      const tree = unified().use(remarkParse).parse(markdown);
      const headings: OutlineNode[] = [];
      
      visit(tree, 'heading', (node: any, index?: number, parent?: any) => {
        const text = toString(node);
        const line = node.position?.start?.line || 0;
        const id = this.generateHeadingId(text);
        
        headings.push({
          depth: node.depth,
          text,
          line,
          id,
        });
      });
      
      // Convert flat list to hierarchical structure
      return this.buildHierarchy(headings);
    } catch (error) {
      console.error('Error generating outline:', error);
      return [];
    }
  }

  private generateHeadingId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  private buildHierarchy(headings: OutlineNode[]): OutlineNode[] {
    const result: OutlineNode[] = [];
    const stack: OutlineNode[] = [];

    for (const heading of headings) {
      // Pop stack until we find the correct parent
      while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
        stack.pop();
      }

      if (stack.length === 0) {
        // This is a root-level heading
        result.push(heading);
      } else {
        // This is a child of the last heading in the stack
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(heading);
      }

      // Add current heading to stack
      stack.push(heading);
    }

    return result;
  }
}

export const markdownService = new MarkdownService();
