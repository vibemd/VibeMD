/**
 * Comprehensive Test Suite for VibeMD Editor Functionality
 * Tests LaTeX insertion, table persistence, and document switching
 */

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:9000',
  timeout: 10000,
  retries: 3
};

// Test data
const TEST_DATA = {
  inlineMath: 'E = mc^2',
  blockMath: '\\int_0^1 x^2 \\, dx = \\frac{1}{3}',
  tableData: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ],
  documentContent: {
    withMath: `# Test Document with Math

This is inline math: $E = mc^2$

This is block math:
$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$

End of document.`,
    withTable: `# Test Document with Table

| 1 | 2 | 3 |
| 4 | 5 | 6 |
| 7 | 8 | 9 |

End of document.`,
    withBoth: `# Test Document with Math and Table

This is inline math: $E = mc^2$

This is block math:
$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$

| 1 | 2 | 3 |
| 4 | 5 | 6 |
| 7 | 8 | 9 |

End of document.`
  }
};

// Test utilities
class TestUtils {
  static async waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  static async waitForText(selector, text, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        const element = document.querySelector(selector);
        if (element && element.textContent.includes(text)) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Text "${text}" not found in ${selector} within ${timeout}ms`));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  static getConsoleErrors() {
    const errors = [];
    const originalError = console.error;
    console.error = (...args) => {
      errors.push(args.join(' '));
      originalError.apply(console, args);
    };
    return errors;
  }

  static restoreConsole() {
    console.error = console.error.__original || console.error;
  }
}

// Test classes
class LaTeXTests {
  static async testInlineMathInsertion() {
    console.log('🧪 Testing inline math insertion...');
    
    try {
      // Open math dialog
      const mathButton = await TestUtils.waitForElement('[data-testid="math-button"]');
      mathButton.click();
      
      // Wait for dialog
      const dialog = await TestUtils.waitForElement('[data-testid="math-dialog"]');
      
      // Enter LaTeX
      const latexInput = await TestUtils.waitForElement('[data-testid="latex-input"]');
      latexInput.value = TEST_DATA.inlineMath;
      
      // Select inline type
      const inlineRadio = await TestUtils.waitForElement('[data-testid="inline-radio"]');
      inlineRadio.click();
      
      // Insert
      const insertButton = await TestUtils.waitForElement('[data-testid="insert-button"]');
      insertButton.click();
      
      // Wait for insertion
      await TestUtils.waitForElement('span[data-type="inline-math"]');
      
      // Verify attributes
      const mathElement = document.querySelector('span[data-type="inline-math"]');
      const hasLatexAttr = mathElement.hasAttribute('data-latex');
      const hasClassAttr = mathElement.classList.contains('math-node');
      
      console.log(`✅ Inline math inserted: latex=${hasLatexAttr}, class=${hasClassAttr}`);
      return hasLatexAttr && hasClassAttr;
      
    } catch (error) {
      console.error('❌ Inline math insertion failed:', error);
      return false;
    }
  }

  static async testBlockMathInsertion() {
    console.log('🧪 Testing block math insertion...');
    
    try {
      // Open math dialog
      const mathButton = await TestUtils.waitForElement('[data-testid="math-button"]');
      mathButton.click();
      
      // Wait for dialog
      const dialog = await TestUtils.waitForElement('[data-testid="math-dialog"]');
      
      // Enter LaTeX
      const latexInput = await TestUtils.waitForElement('[data-testid="latex-input"]');
      latexInput.value = TEST_DATA.blockMath;
      
      // Select block type
      const blockRadio = await TestUtils.waitForElement('[data-testid="block-radio"]');
      blockRadio.click();
      
      // Insert
      const insertButton = await TestUtils.waitForElement('[data-testid="insert-button"]');
      insertButton.click();
      
      // Wait for insertion
      await TestUtils.waitForElement('div[data-type="block-math"]');
      
      // Verify attributes
      const mathElement = document.querySelector('div[data-type="block-math"]');
      const hasLatexAttr = mathElement.hasAttribute('data-latex');
      const hasClassAttr = mathElement.classList.contains('math-node');
      
      console.log(`✅ Block math inserted: latex=${hasLatexAttr}, class=${hasClassAttr}`);
      return hasLatexAttr && hasClassAttr;
      
    } catch (error) {
      console.error('❌ Block math insertion failed:', error);
      return false;
    }
  }

  static async testMathPersistence() {
    console.log('🧪 Testing math persistence across document switches...');
    
    try {
      // Create document with math
      const editor = await TestUtils.waitForElement('.ProseMirror');
      editor.innerHTML = '';
      
      // Insert math via HTML (simulating our fix)
      const mathHtml = `<span data-type="inline-math" data-latex="${TEST_DATA.inlineMath}" class="math-node"></span>`;
      editor.innerHTML = mathHtml;
      
      // Trigger update
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait for markdown conversion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Switch to another document
      const newDocButton = await TestUtils.waitForElement('[data-testid="new-document"]');
      newDocButton.click();
      
      // Wait for new document
      await TestUtils.waitForElement('.ProseMirror');
      
      // Switch back
      const docList = await TestUtils.waitForElement('[data-testid="document-list"]');
      const firstDoc = docList.querySelector('[data-testid="document-item"]');
      firstDoc.click();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if math is still there
      const mathElement = document.querySelector('span[data-type="inline-math"]');
      const exists = !!mathElement;
      const hasCorrectLatex = mathElement?.getAttribute('data-latex') === TEST_DATA.inlineMath;
      
      console.log(`✅ Math persistence: exists=${exists}, correct=${hasCorrectLatex}`);
      return exists && hasCorrectLatex;
      
    } catch (error) {
      console.error('❌ Math persistence test failed:', error);
      return false;
    }
  }
}

class TableTests {
  static async testTableInsertion() {
    console.log('🧪 Testing table insertion...');
    
    try {
      // Open table dialog
      const tableButton = await TestUtils.waitForElement('[data-testid="table-button"]');
      tableButton.click();
      
      // Wait for dialog
      const dialog = await TestUtils.waitForElement('[data-testid="table-dialog"]');
      
      // Set dimensions
      const rowsInput = await TestUtils.waitForElement('[data-testid="rows-input"]');
      const colsInput = await TestUtils.waitForElement('[data-testid="cols-input"]');
      rowsInput.value = '3';
      colsInput.value = '3';
      
      // Insert table
      const insertButton = await TestUtils.waitForElement('[data-testid="insert-table-button"]');
      insertButton.click();
      
      // Wait for table
      await TestUtils.waitForElement('table');
      
      // Verify structure
      const table = document.querySelector('table');
      const rows = table.querySelectorAll('tr');
      const cells = table.querySelectorAll('td');
      
      const hasCorrectRows = rows.length === 3;
      const hasCorrectCells = cells.length === 9;
      
      console.log(`✅ Table inserted: rows=${hasCorrectRows}, cells=${hasCorrectCells}`);
      return hasCorrectRows && hasCorrectCells;
      
    } catch (error) {
      console.error('❌ Table insertion failed:', error);
      return false;
    }
  }

  static async testTablePersistence() {
    console.log('🧪 Testing table persistence across document switches...');
    
    try {
      // Create document with table
      const editor = await TestUtils.waitForElement('.ProseMirror');
      editor.innerHTML = '';
      
      // Insert table via HTML
      const tableHtml = `<table class="border-collapse table-auto w-full" style="min-width: 75px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><td style="text-align: left;"><p>1</p></td><td style="text-align: left;"><p>2</p></td><td style="text-align: left;"><p>3</p></td></tr><tr><td style="text-align: left;"><p>4</p></td><td style="text-align: left;"><p>5</p></td><td style="text-align: left;"><p>6</p></td></tr><tr><td style="text-align: left;"><p>7</p></td><td style="text-align: left;"><p>8</p></td><td style="text-align: left;"><p>9</p></td></tr></tbody></table>`;
      editor.innerHTML = tableHtml;
      
      // Trigger update
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait for markdown conversion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Switch to another document
      const newDocButton = await TestUtils.waitForElement('[data-testid="new-document"]');
      newDocButton.click();
      
      // Wait for new document
      await TestUtils.waitForElement('.ProseMirror');
      
      // Switch back
      const docList = await TestUtils.waitForElement('[data-testid="document-list"]');
      const firstDoc = docList.querySelector('[data-testid="document-item"]');
      firstDoc.click();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if table is still there
      const table = document.querySelector('table');
      const exists = !!table;
      const hasCorrectStructure = table?.querySelectorAll('tr').length === 3;
      
      console.log(`✅ Table persistence: exists=${exists}, structure=${hasCorrectStructure}`);
      return exists && hasCorrectStructure;
      
    } catch (error) {
      console.error('❌ Table persistence test failed:', error);
      return false;
    }
  }
}

class DocumentSwitchTests {
  static async testDocumentSwitching() {
    console.log('🧪 Testing document switching functionality...');
    
    try {
      // Create first document
      const editor = await TestUtils.waitForElement('.ProseMirror');
      editor.innerHTML = '<p>Document 1 content</p>';
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Create second document
      const newDocButton = await TestUtils.waitForElement('[data-testid="new-document"]');
      newDocButton.click();
      
      await TestUtils.waitForElement('.ProseMirror');
      editor.innerHTML = '<p>Document 2 content</p>';
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Switch back to first document
      const docList = await TestUtils.waitForElement('[data-testid="document-list"]');
      const firstDoc = docList.querySelector('[data-testid="document-item"]');
      firstDoc.click();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify content
      const content = editor.textContent;
      const hasCorrectContent = content.includes('Document 1 content');
      
      console.log(`✅ Document switching: content=${hasCorrectContent}`);
      return hasCorrectContent;
      
    } catch (error) {
      console.error('❌ Document switching test failed:', error);
      return false;
    }
  }
}

// Main test runner
class TestRunner {
  static async runAllTests() {
    console.log('🚀 Starting comprehensive test suite...');
    
    const results = {
      latex: {
        inlineInsertion: false,
        blockInsertion: false,
        persistence: false
      },
      table: {
        insertion: false,
        persistence: false
      },
      document: {
        switching: false
      }
    };
    
    try {
      // LaTeX tests
      results.latex.inlineInsertion = await LaTeXTests.testInlineMathInsertion();
      results.latex.blockInsertion = await LaTeXTests.testBlockMathInsertion();
      results.latex.persistence = await LaTeXTests.testMathPersistence();
      
      // Table tests
      results.table.insertion = await TableTests.testTableInsertion();
      results.table.persistence = await TableTests.testTablePersistence();
      
      // Document switching tests
      results.document.switching = await DocumentSwitchTests.testDocumentSwitching();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
    
    // Generate report
    this.generateReport(results);
    
    return results;
  }
  
  static generateReport(results) {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    
    const latexPassed = Object.values(results.latex).filter(Boolean).length;
    const tablePassed = Object.values(results.table).filter(Boolean).length;
    const docPassed = Object.values(results.document).filter(Boolean).length;
    
    console.log(`LaTeX Tests: ${latexPassed}/3 passed`);
    console.log(`Table Tests: ${tablePassed}/2 passed`);
    console.log(`Document Tests: ${docPassed}/1 passed`);
    
    const totalPassed = latexPassed + tablePassed + docPassed;
    const totalTests = 6;
    
    console.log(`\nOverall: ${totalPassed}/${totalTests} tests passed`);
    
    if (totalPassed === totalTests) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️  Some tests failed. Check the logs above for details.');
    }
    
    return {
      totalPassed,
      totalTests,
      success: totalPassed === totalTests
    };
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.TestRunner = TestRunner;
  window.LaTeXTests = LaTeXTests;
  window.TableTests = TableTests;
  window.DocumentSwitchTests = DocumentSwitchTests;
  window.TestUtils = TestUtils;
  window.TEST_DATA = TEST_DATA;
  
  console.log('🧪 Test suite loaded. Run TestRunner.runAllTests() to start testing.');
}

module.exports = {
  TestRunner,
  LaTeXTests,
  TableTests,
  DocumentSwitchTests,
  TestUtils,
  TEST_DATA
};


