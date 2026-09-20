import React, { useRef, useState, useEffect, useCallback } from 'react';

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
  const gutterRef = useRef<HTMLDivElement>(null);

  const [cursorPosition, setCursorPosition] = useState<{ line: number; col: number }>({
    line: 1,
    col: 1,
  });

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

  // Sync line numbers gutter scrolling with textarea
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
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
        const selected = val.substring(start, end);
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

      // Extra indent if line ends with open brace, colon, or open bracket
      const trimmedBefore = currentLine.trim();
      const needsExtraIndent =
        trimmedBefore.endsWith('{') ||
        trimmedBefore.endsWith(':') ||
        trimmedBefore.endsWith('(') ||
        trimmedBefore.endsWith('[');

      // Check if pressing Enter between { and }
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
        // Wrap selection in brackets
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

      // If typing a quote right before the same quote, just step over it
      if ((openChar === '"' || openChar === "'" || openChar === '`') && val[start] === openChar) {
        e.preventDefault();
        target.selectionStart = target.selectionEnd = start + 1;
        updateCursorPosition();
        return;
      }

      // Insert pair
      e.preventDefault();
      const updated = val.substring(0, start) + openChar + closeChar + val.substring(end);
      onChange(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
        updateCursorPosition();
      }, 0);
      return;
    }

    // 4. Step-over closing brackets if already present
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

  // Line count calculations
  const lines = (value || '').split('\n');
  const lineCount = Math.max(lines.length, 16);
  const lineHeightPx = Math.round(fontSize * 1.6);

  useEffect(() => {
    updateCursorPosition();
  }, [value, updateCursorPosition]);

  return (
    <div
      onClick={handleContainerClick}
      className="relative flex flex-col w-full h-full min-h-0 bg-[#0d1522] border border-slate-700/80 rounded-2xl overflow-hidden shadow-inner text-slate-200 select-text font-mono cursor-text"
      style={{
        minHeight,
        height: minHeight === '100%' ? '100%' : undefined,
      }}
    >
      {/* Editor Body: Gutter + Direct Crisp Textarea */}
      <div className="relative flex flex-1 w-full h-full min-h-0 overflow-hidden">
        {/* ----------------------------------------------------------- */}
        {/* Line Numbers Gutter                                         */}
        {/* ----------------------------------------------------------- */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 bg-[#090f19] border-r border-slate-800/80 py-3 pr-2.5 text-right text-slate-500 font-mono select-none shrink-0 overflow-hidden transition-colors"
          style={{
            fontSize: `${Math.max(11, fontSize - 2)}px`,
            lineHeight: `${lineHeightPx}px`,
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const isCurrentLine = i + 1 === cursorPosition.line;
            return (
              <div
                key={i + 1}
                className={`transition-colors ${
                  isCurrentLine ? 'text-blue-400 font-bold' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* Real Visible Code Editor Textarea                           */}
        {/* ----------------------------------------------------------- */}
        <div className="relative flex-1 h-full min-h-0 overflow-hidden bg-[#0d1522]">
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
            readOnly={readOnly}
            placeholder={placeholder}
            className="w-full h-full p-3 m-0 font-mono bg-transparent text-slate-100 placeholder-slate-600 focus:outline-hidden resize-none whitespace-pre overflow-auto selection:bg-blue-600/50 selection:text-white custom-scrollbar border-0"
            style={{
              fontFamily: "Consolas, 'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeightPx}px`,
              tabSize: 4,
              caretColor: '#38bdf8',
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
