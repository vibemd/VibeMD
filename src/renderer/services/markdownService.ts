import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export interface OutlineNode {
  depth: number;
  text: string;
  line: number;
  children?: OutlineNode[];
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
        
        headings.push({
          depth: node.depth,
          text,
          line,
        });
      });
      
      return headings;
    } catch (error) {
      console.error('Error generating outline:', error);
      return [];
    }
  }
}

export const markdownService = new MarkdownService();
