import React, { useRef, useMemo } from 'react';

interface CodeEditorWithSyntaxProps {
  value: string;
  onChange: (val: string) => void;
  language: 'java' | 'cpp' | 'python' | 'javascript';
  fontSize?: number;
  readOnly?: boolean;
  placeholder?: string;
  minHeight?: string;
}

export const CodeEditorWithSyntax: React.FC<CodeEditorWithSyntaxProps> = ({
  value,
  onChange,
  language,
  fontSize = 13,
  readOnly = false,
  placeholder = '// Write your code here...',
  minHeight = '320px',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Sync scroll positions between textarea, syntax pre layer, and line numbers gutter
  const handleScroll = () => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (preRef.current) {
        preRef.current.scrollTop = scrollTop;
        preRef.current.scrollLeft = scrollLeft;
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = scrollTop;
      }
    }
  };

  // Keyboard handlers: Tab key, bracket pairs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const updated = val.substring(0, start) + '    ' + val.substring(end);
      onChange(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Tokenize and highlight code with VS Code OneDark / Monokai palette
  const highlightedHTML = useMemo(() => {
    if (!value) return '';

    // 1. HTML entity escape
    let escaped = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const tokens: string[] = [];
    const addToken = (html: string) => {
      tokens.push(html);
      return `___GKCE_TOK_${tokens.length - 1}___`;
    };

    // 2. Comments (Single line & multi-line & python #)
    escaped = escaped.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g, (m) => {
      return addToken(`<span style="color: #6a737d; font-style: italic;">${m}</span>`);
    });

    // 3. String literals ("..." or '...')
    escaped = escaped.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g, (m) => {
      return addToken(`<span style="color: #98c379;">${m}</span>`);
    });

    // 4. Keywords
    const keywords = [
      'class', 'public', 'private', 'protected', 'static', 'final', 'void', 'int', 'long', 'float', 'double',
      'boolean', 'bool', 'char', 'string', 'if', 'else', 'for', 'while', 'do', 'return', 'def', 'import',
      'from', 'in', 'is', 'not', 'and', 'or', 'true', 'false', 'True', 'False', 'null', 'nullptr', 'None',
      'new', 'struct', 'auto', 'const', 'let', 'var', 'function', 'async', 'await', 'try', 'catch', 'finally',
      'throw', 'throws', 'sizeof', 'typeof', 'include', 'namespace', 'using', 'std', 'this', 'self', 'extends', 'implements'
    ];
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(kwRegex, (m) => {
      return addToken(`<span style="color: #c678dd; font-weight: 600;">${m}</span>`);
    });

    // 5. Types & Built-in Classes
    const types = [
      'Solution', 'Scanner', 'System', 'String', 'Math', 'Vector', 'vector', 'List', 'ArrayList',
      'Map', 'HashMap', 'Set', 'HashSet', 'Stack', 'Queue', 'TreeNode', 'ListNode', 'Console',
      'Integer', 'Boolean', 'Double', 'Long', 'Character', 'Object', 'Arrays', 'Collections', 'cin', 'cout', 'endl'
    ];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, (m) => {
      return addToken(`<span style="color: #e5c07b;">${m}</span>`);
    });

    // 6. Function / Method Invocations (word followed by '(')
    escaped = escaped.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, (m) => {
      return addToken(`<span style="color: #61afef;">${m}</span>`);
    });

    // 7. Numbers
    escaped = escaped.replace(/\b\d+(\.\d+)?\b/g, (m) => {
      return addToken(`<span style="color: #d19a66;">${m}</span>`);
    });

    // 8. Restore protected tokens
    escaped = escaped.replace(/___GKCE_TOK_(\d+)___/g, (_, id) => tokens[parseInt(id, 10)]);

    // Ensure trailing newline renders properly
    if (value.endsWith('\n')) {
      escaped += '<br/>';
    }

    return escaped;
  }, [value, language]);

  // Line count
  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 18);

  return (
    <div
      className="relative flex overflow-hidden bg-[#1e1e1e] text-[#d4d4d4] font-mono select-text code-editor-wrap"
      style={{ minHeight, fontSize: `${fontSize}px`, lineHeight: `${fontSize * 1.55}px` }}
    >
      {/* ----------------------------------------------------------- */}
      {/* Line Numbers Gutter                                         */}
      {/* ----------------------------------------------------------- */}
      <div
        ref={gutterRef}
        className="w-12 bg-[#1e1e1e] border-r border-[#333333] py-3 pr-3 text-right text-[#858585] select-none font-mono shrink-0 overflow-hidden"
        style={{ fontSize: `${fontSize * 0.9}px`, lineHeight: `${fontSize * 1.55}px` }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} className="hover:text-[#c6c6c6] transition-colors">
            {i + 1}
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Dual-Layer Synced Editor (VS Code Syntax Highlight Layer)   */}
      {/* ----------------------------------------------------------- */}
      <div className="relative flex-1 h-full overflow-hidden bg-[#1e1e1e]">
        {/* Layer 1: Background Syntax Highlight (Pre) */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 p-3 m-0 font-mono overflow-hidden pointer-events-none whitespace-pre select-none text-[#abb2bf] custom-scrollbar"
          style={{
            fontFamily: "Consolas, 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize * 1.55}px`,
            tabSize: 4,
          }}
          dangerouslySetInnerHTML={{ __html: highlightedHTML }}
        />

        {/* Layer 2: Foreground Transparent Editable Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          disabled={readOnly}
          placeholder={placeholder}
          className="absolute inset-0 p-3 m-0 font-mono bg-transparent text-transparent caret-[#528bff] focus:outline-hidden resize-none whitespace-pre overflow-auto leading-normal selection:bg-[#264f78] selection:text-transparent custom-scrollbar z-10"
          style={{
            fontFamily: "Consolas, 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize * 1.55}px`,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
};
