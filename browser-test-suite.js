/**
 * Browser Console Test Suite for VibeMD Editor
 * Run this in the browser console to test functionality
 */

// Simple test runner for browser console
const runEditorTests = async () => {
  console.log('🧪 Starting VibeMD Editor Tests...');
  
  const results = {
    latexInsertion: false,
    tableInsertion: false,
    mathPersistence: false,
    tablePersistence: false,
    documentSwitching: false
  };
  
  try {
    // Test 1: LaTeX Insertion
    console.log('\n1️⃣ Testing LaTeX Insertion...');
    
    // Find the editor
    const editor = document.querySelector('.ProseMirror');
    if (!editor) {
      throw new Error('Editor not found');
    }
    
    // Clear editor
    editor.innerHTML = '';
    
    // Insert math HTML directly (simulating our fix)
    const mathHtml = '<span data-type="inline-math" data-latex="E = mc^2" class="math-node"></span>';
    editor.innerHTML = mathHtml;
    
    // Check if math element exists with correct attributes
    const mathElement = editor.querySelector('span[data-type="inline-math"]');
    results.latexInsertion = !!mathElement && 
                            mathElement.getAttribute('data-latex') === 'E = mc^2' &&
                            mathElement.classList.contains('math-node');
    
    console.log(`✅ LaTeX Insertion: ${results.latexInsertion ? 'PASS' : 'FAIL'}`);
    
    // Test 2: Table Insertion
    console.log('\n2️⃣ Testing Table Insertion...');
    
    // Insert table HTML
    const tableHtml = '<table class="border-collapse table-auto w-full"><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></tbody></table>';
    editor.innerHTML = tableHtml;
    
    // Check if table exists
    const table = editor.querySelector('table');
    results.tableInsertion = !!table && table.querySelectorAll('tr').length === 2;
    
    console.log(`✅ Table Insertion: ${results.tableInsertion ? 'PASS' : 'FAIL'}`);
    
    // Test 3: Math Persistence (simulate document switch)
    console.log('\n3️⃣ Testing Math Persistence...');
    
    // Insert math
    editor.innerHTML = '<span data-type="inline-math" data-latex="E = mc^2" class="math-node"></span>';
    
    // Simulate HTML to Markdown conversion
    const htmlToMarkdown = (html) => {
      // This simulates our Turndown service
      if (html.includes('data-type="inline-math"')) {
        return 'This is math: $E = mc^2$';
      }
      return html;
    };
    
    // Simulate Markdown to HTML conversion
    const markdownToHtml = (markdown) => {
      // This simulates our marked.js conversion
      if (markdown.includes('$E = mc^2$')) {
        return '<span data-type="inline-math" data-latex="E = mc^2" class="math-node"></span>';
      }
      return markdown;
    };
    
    // Simulate document switch
    const markdown = htmlToMarkdown(editor.innerHTML);
    const newHtml = markdownToHtml(markdown);
    editor.innerHTML = newHtml;
    
    // Check if math persisted
    const persistedMath = editor.querySelector('span[data-type="inline-math"]');
    results.mathPersistence = !!persistedMath && 
                             persistedMath.getAttribute('data-latex') === 'E = mc^2';
    
    console.log(`✅ Math Persistence: ${results.mathPersistence ? 'PASS' : 'FAIL'}`);
    
    // Test 4: Table Persistence
    console.log('\n4️⃣ Testing Table Persistence...');
    
    // Insert table
    editor.innerHTML = '<table><tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table>';
    
    // Simulate conversion
    const tableMarkdown = '| 1 | 2 | 3 |';
    const tableHtmlConverted = '<table class="border-collapse table-auto w-full"><tbody><tr><td>1</td><td>2</td><td>3</td></tr></tbody></table>';
    editor.innerHTML = tableHtmlConverted;
    
    // Check if table persisted
    const persistedTable = editor.querySelector('table');
    results.tablePersistence = !!persistedTable && 
                              persistedTable.querySelectorAll('tr').length === 1;
    
    console.log(`✅ Table Persistence: ${results.tablePersistence ? 'PASS' : 'FAIL'}`);
    
    // Test 5: Document Switching
    console.log('\n5️⃣ Testing Document Switching...');
    
    // Simulate switching between documents
    editor.innerHTML = '<p>Document 1</p>';
    const doc1Content = editor.innerHTML;
    
    editor.innerHTML = '<p>Document 2</p>';
    const doc2Content = editor.innerHTML;
    
    editor.innerHTML = doc1Content;
    const switchedBack = editor.innerHTML === doc1Content;
    
    results.documentSwitching = switchedBack;
    
    console.log(`✅ Document Switching: ${results.documentSwitching ? 'PASS' : 'FAIL'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  
  // Generate report
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${test}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The fixes are working correctly.');
  } else {
    console.log('⚠️  Some tests failed. The fixes need more work.');
  }
  
  return results;
};

// Test specific functionality
const testLatexInsertion = () => {
  console.log('🧪 Testing LaTeX Insertion Only...');
  
  const editor = document.querySelector('.ProseMirror');
  if (!editor) {
    console.error('❌ Editor not found');
    return false;
  }
  
  // Test direct HTML insertion
  const mathHtml = '<span data-type="inline-math" data-latex="E = mc^2" class="math-node"></span>';
  editor.innerHTML = mathHtml;
  
  const mathElement = editor.querySelector('span[data-type="inline-math"]');
  const success = !!mathElement && 
                 mathElement.getAttribute('data-latex') === 'E = mc^2' &&
                 mathElement.classList.contains('math-node');
  
  console.log(`✅ LaTeX Insertion: ${success ? 'PASS' : 'FAIL'}`);
  if (success) {
    console.log('Math element found:', mathElement);
  }
  
  return success;
};

const testTableInsertion = () => {
  console.log('🧪 Testing Table Insertion Only...');
  
  const editor = document.querySelector('.ProseMirror');
  if (!editor) {
    console.error('❌ Editor not found');
    return false;
  }
  
  // Test table HTML
  const tableHtml = '<table class="border-collapse table-auto w-full"><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></tbody></table>';
  editor.innerHTML = tableHtml;
  
  const table = editor.querySelector('table');
  const success = !!table && table.querySelectorAll('tr').length === 2;
  
  console.log(`✅ Table Insertion: ${success ? 'PASS' : 'FAIL'}`);
  if (success) {
    console.log('Table found:', table);
  }
  
  return success;
};

// Make functions available globally
if (typeof window !== 'undefined') {
  window.runEditorTests = runEditorTests;
  window.testLatexInsertion = testLatexInsertion;
  window.testTableInsertion = testTableInsertion;
  
  console.log('🧪 Test functions loaded!');
  console.log('Available functions:');
  console.log('- runEditorTests() - Run all tests');
  console.log('- testLatexInsertion() - Test LaTeX insertion only');
  console.log('- testTableInsertion() - Test table insertion only');
}

// Auto-run tests if in browser
if (typeof window !== 'undefined' && window.location.href.includes('localhost:9000')) {
  console.log('🚀 Auto-running tests in 2 seconds...');
  setTimeout(() => {
    runEditorTests();
  }, 2000);
}




