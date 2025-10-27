const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');
const moduleCache = new Map();

function resolveModulePath(relativePath) {
  const absoluteBase = path.resolve(projectRoot, relativePath);
  const candidates = [];
  const ext = path.extname(absoluteBase);

  if (ext) {
    candidates.push(absoluteBase);
  } else {
    candidates.push(
      `${absoluteBase}.ts`,
      `${absoluteBase}.tsx`,
      `${absoluteBase}.js`,
      `${absoluteBase}.jsx`,
      path.join(absoluteBase, 'index.ts'),
      path.join(absoluteBase, 'index.tsx'),
      path.join(absoluteBase, 'index.js'),
      path.join(absoluteBase, 'index.jsx'),
    );
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Unable to resolve module: ${relativePath}`);
}

function loadTsModule(relativePath) {
  const absolutePath = resolveModulePath(relativePath);
  const cacheKey = path.relative(projectRoot, absolutePath);

  if (moduleCache.has(cacheKey)) {
    return moduleCache.get(cacheKey);
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    },
    fileName: absolutePath,
  });

  const placeholder = {};
  moduleCache.set(cacheKey, placeholder);

  const module = { exports: placeholder };

  const requireFn = (specifier) => {
    if (specifier.startsWith('.')) {
      const resolved = path.resolve(path.dirname(absolutePath), specifier);
      const relative = path.relative(projectRoot, resolved);
      return loadTsModule(relative);
    }
    if (specifier.startsWith('@/')) {
      const resolved = path.resolve(projectRoot, 'src/renderer', specifier.slice(2));
      const relative = path.relative(projectRoot, resolved);
      return loadTsModule(relative);
    }
    if (specifier.startsWith('@main/')) {
      const resolved = path.resolve(projectRoot, 'src/main', specifier.slice(6));
      const relative = path.relative(projectRoot, resolved);
      return loadTsModule(relative);
    }
    if (specifier.startsWith('@shared/')) {
      const resolved = path.resolve(projectRoot, 'src/shared', specifier.slice(8));
      const relative = path.relative(projectRoot, resolved);
      return loadTsModule(relative);
    }
    return require(specifier);
  };

  const evaluator = new Function('require', 'module', 'exports', outputText);
  evaluator(requireFn, module, module.exports);

  moduleCache.set(cacheKey, module.exports);
  return module.exports;
}

const { useNavigationStore } = loadTsModule('src/renderer/services/navigationService.ts');

beforeEach(() => {
  useNavigationStore.getState().clearScrollToHeadingHandler();
});

test('initial state has no scroll handler', () => {
  const state = useNavigationStore.getState();

  assert.equal(state.hasScrollHandler, false);
  assert.doesNotThrow(() => state.scrollToHeading('heading-1'));
});

test('registering a scroll handler stores and calls it', () => {
  const calls = [];
  const handler = (headingId) => {
    calls.push(headingId);
  };

  useNavigationStore.getState().setScrollToHeadingHandler(handler);

  const state = useNavigationStore.getState();
  assert.equal(state.hasScrollHandler, true);

  state.scrollToHeading('heading-2');
  assert.deepEqual(calls, ['heading-2']);
});

test('clearing the handler resets state and prevents further calls', () => {
  let calledAfterClear = false;
  const handler = () => {
    calledAfterClear = true;
  };

  const store = useNavigationStore.getState();
  store.setScrollToHeadingHandler(handler);
  store.clearScrollToHeadingHandler();

  const state = useNavigationStore.getState();
  assert.equal(state.hasScrollHandler, false);

  assert.doesNotThrow(() => state.scrollToHeading('heading-3'));
  assert.equal(calledAfterClear, false);
});
