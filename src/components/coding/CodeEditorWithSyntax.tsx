import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

interface CodeEditorWithSyntaxProps {
  value: string;
  onChange: (val: string) => void;
  language: 'java' | 'cpp' | 'python' | 'javascript';
  fontSize?: number;
  readOnly?: boolean;
  placeholder?: string;
  minHeight?: string;
}

const BRACKET_PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
  '`': '`',
};

const CLOSING_BRACKETS = new Set([')', ']', '}', '"', "'", '`']);

const KEYWORDS = new Set([
  'class', 'public', 'private', 'protected', 'static', 'final', 'void', 'int', 'long', 'float', 'double',
  'boolean', 'bool', 'char', 'string', 'if', 'else', 'elif', 'for', 'while', 'do', 'return', 'def', 'import',
  'from', 'in', 'is', 'not', 'and', 'or', 'true', 'false', 'True', 'False', 'null', 'nullptr', 'None',
  'new', 'struct', 'auto', 'const', 'let', 'var', 'function', 'async', 'await', 'try', 'catch', 'finally',
  'throw', 'throws', 'sizeof', 'typeof', 'include', 'namespace', 'using', 'std', 'this', 'self', 'extends',
  'implements', 'pass', 'break', 'continue', 'yield', 'lambda', 'as', 'with', 'except', 'raise'
]);

const TYPES = new Set([
  'Main', 'Solution', 'Scanner', 'System', 'String', 'Math', 'Vector', 'vector', 'List', 'ArrayList',
  'Map', 'HashMap', 'Set', 'HashSet', 'Stack', 'Queue', 'TreeNode', 'ListNode', 'Console',
  'Integer', 'Boolean', 'Double', 'Long', 'Character', 'Object', 'Arrays', 'Collections',
  'cin', 'cout', 'endl'
]);

const BUILTIN_FUNCS = new Set([
  'println', 'print', 'printf', 'main', 'solve', 'next', 'nextInt', 'nextLine', 'nextDouble',
  'hasNext', 'hasNextInt', 'range', 'len', 'str', 'dict', 'list', 'tuple', 'set',
  'push_back', 'pop_back', 'push', 'pop', 'peek', 'append', 'size', 'length', 'substring',
  'charAt', 'indexOf', 'split', 'trim', 'toLowerCase', 'toUpperCase', 'parseInt', 'parseFloat'
]);

export const CodeEditorWithSyntax: React.FC<CodeEditorWithSyntaxProps> = ({
  value,
  onChange,
  language,
  fontSize = 13,
  readOnly = false,
  placeholder = '// Write your optimal solution here...',
  minHeight = '320px',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [cursorPosition, setCursorPosition] = useState<{ line: number; col: number }>({
    line: 1,
    col: 1,
  });
  const [scrollTop, setScrollTop] = useState<number>(0);

  const lineHeightPx = 22;
  const paddingPx = 12;

  // Calculate current Line & Column for cursor tracking
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current) return;
    const selStart = textareaRef.current.selectionStart;
    const textBefore = (value || '').substring(0, selStart);
    const lines = textBefore.split('\n');
    setCursorPosition({
      line: lines.length,
      col: (lines[lines.length - 1]?.length || 0) + 1,
    });
  }, [value]);

  // Sync line numbers gutter & syntax pre layer scrolling with textarea in real time
  const handleScroll = () => {
    if (textareaRef.current) {
      const { scrollTop: st, scrollLeft: sl } = textareaRef.current;
      setScrollTop(st);
      if (preRef.current) {
        preRef.current.scrollTop = st;
        preRef.current.scrollLeft = sl;
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = st;
      }
    }
  };

  // Keyboard shortcut and editor intelligence handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const val = target.value;

    // 1. Tab & Shift+Tab handling (4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();

      if (start !== end) {
        // Multi-line indent / dedent
        const before = val.substring(0, start);
        const after = val.substring(end);

        const lineStart = before.lastIndexOf('\n') + 1;
        const affected = val.substring(lineStart, end);
        const lines = affected.split('\n');

        if (e.shiftKey) {
          // Dedent: remove up to 4 spaces from each line
          const dedented = lines.map(line => line.replace(/^ {1,4}/, '')).join('\n');
          const newCode = val.substring(0, lineStart) + dedented + after;
          onChange(newCode);
          setTimeout(() => {
            target.selectionStart = lineStart;
            target.selectionEnd = lineStart + dedented.length;
          }, 0);
        } else {
          // Indent: add 4 spaces to each line
          const indented = lines.map(line => '    ' + line).join('\n');
          const newCode = val.substring(0, lineStart) + indented + after;
          onChange(newCode);
          setTimeout(() => {
            target.selectionStart = lineStart;
            target.selectionEnd = lineStart + indented.length;
          }, 0);
        }
      } else {
        if (e.shiftKey) {
          // Single line dedent
          const lineStart = val.lastIndexOf('\n', start - 1) + 1;
          const currentLine = val.substring(lineStart, start);
          if (currentLine.endsWith('    ')) {
            const newCode = val.substring(0, start - 4) + val.substring(start);
            onChange(newCode);
            setTimeout(() => {
              target.selectionStart = target.selectionEnd = Math.max(lineStart, start - 4);
              updateCursorPosition();
            }, 0);
          }
        } else {
          // Insert 4 spaces
          const updated = val.substring(0, start) + '    ' + val.substring(end);
          onChange(updated);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 4;
            updateCursorPosition();
          }, 0);
        }
      }
      return;
    }

    // 2. Intelligent Enter key: Auto-indentation based on previous line
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const currentLine = val.substring(lineStart, start);
      const matchIndent = currentLine.match(/^[ \t]*/);
      let indent = matchIndent ? matchIndent[0] : '';

      const trimmedBefore = currentLine.trim();
      const needsExtraIndent =
        trimmedBefore.endsWith('{') ||
        trimmedBefore.endsWith(':') ||
        trimmedBefore.endsWith('(') ||
        trimmedBefore.endsWith('[');

      const charBefore = val[start - 1];
      const charAfter = val[start];
      const isBetweenBraces = charBefore === '{' && charAfter === '}';

      if (isBetweenBraces) {
        const extraIndent = indent + '    ';
        const updated = val.substring(0, start) + '\n' + extraIndent + '\n' + indent + val.substring(end);
        onChange(updated);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 1 + extraIndent.length;
          updateCursorPosition();
        }, 0);
        return;
      }

      if (needsExtraIndent) {
        indent += '    ';
      }

      const updated = val.substring(0, start) + '\n' + indent + val.substring(end);
      onChange(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1 + indent.length;
        updateCursorPosition();
      }, 0);
      return;
    }

    // 3. Auto-closing brackets and quotes
    if (BRACKET_PAIRS[e.key]) {
      const openChar = e.key;
      const closeChar = BRACKET_PAIRS[openChar];

      if (start !== end) {
        e.preventDefault();
        const selected = val.substring(start, end);
        const updated = val.substring(0, start) + openChar + selected + closeChar + val.substring(end);
        onChange(updated);
        setTimeout(() => {
          target.selectionStart = start + 1;
          target.selectionEnd = end + 1;
        }, 0);
        return;
      }

      // If typing a quote right before the same quote, step over it
      if ((openChar === '"' || openChar === "'" || openChar === '`') && val[start] === openChar) {
        e.preventDefault();
        target.selectionStart = target.selectionEnd = start + 1;
        updateCursorPosition();
        return;
      }

      e.preventDefault();
      const updated = val.substring(0, start) + openChar + closeChar + val.substring(end);
      onChange(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
        updateCursorPosition();
      }, 0);
      return;
    }

    // 4. Step-over closing brackets
    if (CLOSING_BRACKETS.has(e.key) && val[start] === e.key && start === end) {
      e.preventDefault();
      target.selectionStart = target.selectionEnd = start + 1;
      updateCursorPosition();
      return;
    }

    // 5. Backspace between empty bracket pairs deletes both
    if (e.key === 'Backspace' && start === end && start > 0) {
      const charBefore = val[start - 1];
      const charAfter = val[start];
      if (BRACKET_PAIRS[charBefore] === charAfter) {
        e.preventDefault();
        const updated = val.substring(0, start - 1) + val.substring(start + 1);
        onChange(updated);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start - 1;
          updateCursorPosition();
        }, 0);
        return;
      }
    }
  };

  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // High-precision syntax highlighting generator:
  // Strictly maintains 1:1 character alignment with zero bolding width drift
  const highlightedHTML = useMemo(() => {
    if (!value) return '';

    const escapeHtml = (text: string) =>
      text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Accurate token matcher for comments, strings, numbers, words
    const tokenRegex =
      language === 'python'
        ? /(#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)/g
        : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)/g;

    let result = '';
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        result += escapeHtml(value.slice(lastIndex, match.index));
      }

      const [, comment, str, num, word] = match;

      if (comment !== undefined) {
        result += `<span style="color: #7f848e; font-style: normal; font-weight: 400;">${escapeHtml(comment)}</span>`;
      } else if (str !== undefined) {
        result += `<span style="color: #98c379; font-style: normal; font-weight: 400;">${escapeHtml(str)}</span>`;
      } else if (num !== undefined) {
        result += `<span style="color: #d19a66; font-style: normal; font-weight: 400;">${escapeHtml(num)}</span>`;
      } else if (word !== undefined) {
        if (KEYWORDS.has(word)) {
          result += `<span style="color: #c678dd; font-style: normal; font-weight: 400;">${escapeHtml(word)}</span>`;
        } else if (TYPES.has(word)) {
          result += `<span style="color: #e5c07b; font-style: normal; font-weight: 400;">${escapeHtml(word)}</span>`;
        } else if (BUILTIN_FUNCS.has(word)) {
          result += `<span style="color: #61afef; font-style: normal; font-weight: 400;">${escapeHtml(word)}</span>`;
        } else {
          result += `<span style="color: #abb2bf; font-style: normal; font-weight: 400;">${escapeHtml(word)}</span>`;
        }
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < value.length) {
      result += escapeHtml(value.slice(lastIndex));
    }

    return result;
  }, [value, language]);

  // Line count calculations
  const lines = (value || '').split('\n');
  const lineCount = Math.max(lines.length, 16);

  useEffect(() => {
    updateCursorPosition();
  }, [value, updateCursorPosition]);

  const sharedFontStyle: React.CSSProperties = {
    fontFamily: "Consolas, 'Cascadia Code', 'Fira Code', Menlo, Monaco, monospace",
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeightPx}px`,
    fontWeight: 400,
    fontStyle: 'normal',
    letterSpacing: '0px',
    wordSpacing: '0px',
    tabSize: 4,
    MozTabSize: 4,
    whiteSpace: 'pre',
    wordBreak: 'normal',
    overflowWrap: 'normal',
    fontVariantLigatures: 'none',
    fontFeatureSettings: '"liga" 0, "calt" 0',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'geometricPrecision',
    padding: `${paddingPx}px 14px`,
    margin: '0px',
    border: '0px solid transparent',
    boxSizing: 'border-box',
    textAlign: 'left',
  };

  return (
    <div
      onClick={handleContainerClick}
      className="relative flex flex-col w-full bg-[#0d1522] border border-slate-700/80 rounded-2xl overflow-hidden shadow-inner select-text font-mono cursor-text"
      style={{
        minHeight,
        height: minHeight === '100%' ? '100%' : minHeight,
      }}
    >
      {/* Editor Body: Gutter + Synced Syntax Layer + Transparent Textarea */}
      <div className="relative flex flex-1 w-full h-full min-h-0 overflow-hidden">
        {/* ----------------------------------------------------------- */}
        {/* Line Numbers Gutter                                         */}
        {/* ----------------------------------------------------------- */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 bg-[#080e18] border-r border-slate-800/90 text-right font-mono select-none shrink-0 overflow-hidden"
          style={{
            paddingTop: `${paddingPx}px`,
            paddingBottom: `${paddingPx}px`,
            paddingRight: '10px',
            boxSizing: 'border-box',
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const isCurrentLine = i + 1 === cursorPosition.line;
            return (
              <div
                key={i + 1}
                className={`select-none transition-colors ${
                  isCurrentLine ? 'text-blue-400 font-bold' : 'text-slate-600'
                }`}
                style={{
                  height: `${lineHeightPx}px`,
                  lineHeight: `${lineHeightPx}px`,
                  fontSize: `${Math.max(11, fontSize - 2)}px`,
                  fontFamily: "Consolas, 'Cascadia Code', 'Fira Code', Menlo, Monaco, monospace",
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* Dual-Layer Synced Editor: Syntax Highlighting + Interactive  */}
        {/* ----------------------------------------------------------- */}
        <div className="relative flex-1 h-full min-h-0 overflow-hidden bg-[#0d1522]">
          {/* Active Line Background Highlight */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 pointer-events-none bg-blue-500/10 border-y border-blue-500/15"
            style={{
              top: `${paddingPx + (cursorPosition.line - 1) * lineHeightPx - scrollTop}px`,
              height: `${lineHeightPx}px`,
              zIndex: 1,
            }}
          />

          {/* Layer 1: Colored Syntax Highlighting Layer (Underneath) */}
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none text-[#abb2bf] select-none"
            style={{
              ...sharedFontStyle,
              zIndex: 2,
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHTML + (value.endsWith('\n') ? ' ' : '') }}
          />

          {/* Layer 2: Real Editable Textarea (Foreground Transparent with Caret) */}
          <textarea
            ref={textareaRef}
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition();
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onSelect={updateCursorPosition}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            readOnly={readOnly}
            placeholder={placeholder}
            className="code-editor-textarea absolute inset-0 bg-transparent text-transparent placeholder-slate-600 resize-none overflow-auto custom-scrollbar selection:bg-blue-600/35 selection:text-transparent"
            style={{
              ...sharedFontStyle,
              caretColor: '#38bdf8',
              outline: 'none',
              zIndex: 3,
            }}
          />
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Editor Footer Status Bar                                    */}
      {/* ----------------------------------------------------------- */}
      <div className="h-6 shrink-0 bg-[#070c14] border-t border-slate-800/80 px-3 flex items-center justify-between text-[11px] text-slate-400 select-none font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="uppercase font-bold text-slate-300">
            {language === 'cpp' ? 'C++' : language === 'javascript' ? 'JavaScript' : language}
          </span>
          <span className="text-slate-600">&bull;</span>
          <span>UTF-8</span>
          <span className="text-slate-600">&bull;</span>
          <span>Spaces: 4</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>
            Ln <strong className="text-slate-200">{cursorPosition.line}</strong>, Col{' '}
            <strong className="text-slate-200">{cursorPosition.col}</strong>
          </span>
          <span className="text-slate-600">&bull;</span>
          <span>{(value || '').length} chars</span>
        </div>
      </div>
    </div>
  );
};
