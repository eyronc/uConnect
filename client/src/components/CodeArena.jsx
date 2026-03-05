import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Play, AlertCircle, Trophy, Zap, Crown, ChevronRight } from 'lucide-react';

export default function CodeArena({ onClose, problem }) {
  const [player1Code, setPlayer1Code] = useState('// Player 1: Solve the problem below\nfunction solution() {\n  // Write your solution here\n  return 0;\n}');
  const [player2Code, setPlayer2Code] = useState('');
  const [player1Tests, setPlayer1Tests] = useState(0);
  const [player2Tests, setPlayer2Tests] = useState(0);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(15);
  const [tabSwitches, setTabSwitches] = useState({ p1: 0 });
  const [showWarning, setShowWarning] = useState(false);
  const [disqualified, setDisqualified] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    if (problem) {
      setPlayer1Code(problem.starterCode || '');
      let bot = problem.starterCode || '';
      if (problem.testCases?.length) {
        const firstExp = problem.testCases[0].expected;
        bot = bot.replace(/return\s+[^;]+;/, `return ${JSON.stringify(firstExp)};`);
      }
      setPlayer2Code(bot);
      setTimer(15);
      setPlayer1Tests(0); setPlayer2Tests(0);
      setWinner(null); setShowWarning(false);
      setTabSwitches({ p1: 0 }); setDisqualified(null);
    }
  }, [problem]);

  const testCases = problem?.testCases || [];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => {
          const newCount = prev.p1 + 1;
          if (newCount >= 1) setShowWarning(true);
          if (newCount >= 2) setDisqualified('Player 1');
          return { p1: newCount };
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (timer > 0 && !winner && !disqualified) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
  }, [timer, winner, disqualified]);

  const runTests = useCallback((code, isPlayer1) => {
    let passedTests = 0;
    if (problem?.solution) {
      const normalize = s => (s || '').replace(/\s+/g, '').replace(/;$/, '');
      try {
        if (normalize(code).includes(normalize(problem.solution)) || normalize(problem.solution).includes(normalize(code))) {
          if (isPlayer1) { setPlayer1Tests(testCases.length); setWinner('Player 1'); }
          else { setPlayer2Tests(testCases.length); setWinner('Player 2'); }
          return;
        }
      } catch (e) {}
    }

    let fnName = null, fnParams = '';
    if (problem?.starterCode) {
      const sigMatch = problem.starterCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
      if (sigMatch) { fnName = sigMatch[1]; fnParams = sigMatch[2]; }
    }

    let userFn = null;
    if (fnName) {
      let userBody = code;
      const bodyMatch = code.match(/function\s+\w+\s*\([^)]*\)\s*\{([\s\S]*)\}$/);
      if (bodyMatch) userBody = bodyMatch[1];
      try {
        const params = fnParams.split(',').map(p => p.trim()).filter(Boolean);
        userFn = new Function(...params, userBody);
      } catch (err) {}
    }

    testCases.forEach(tc => {
      try {
        const callMatch = tc.input.match(/(\w+)\s*\((.*)\)/);
        if (!callMatch) return;
        const argsRaw = callMatch[2].trim();
        let args = [];
        if (argsRaw) args = (new Function(`return [${argsRaw}]`))();
        let result;
        if (userFn && callMatch[1] === fnName) result = userFn(...args);
        else result = eval(tc.input);
        if (result === tc.expected) passedTests++;
      } catch (e) {}
    });

    if (isPlayer1) { setPlayer1Tests(passedTests); if (passedTests === testCases.length) setWinner('Player 1'); }
    else { setPlayer2Tests(passedTests); if (passedTests === testCases.length) setWinner('Player 2'); }
  }, [problem, testCases]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setPlayer1Code(prev => prev.substring(0, start) + '  ' + prev.substring(end));
      e.target.selectionStart = e.target.selectionEnd = start + 2;
    }
  }, []);

  const TestDots = ({ passed, total }) => (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8,
          background: i < passed ? '#1a7a4a' : '#ddd8d0',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );

  /* ── Disqualified screen ── */
  if (disqualified) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(26,21,16,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,600&display=swap');`}</style>
      <div style={{ background: '#F7F3EE', border: '1px solid #ddd8d0', padding: '2.5rem', maxWidth: 360, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, background: '#fff4f4', border: '1px solid #f8c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={22} color="#c83030" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 700, color: '#1a1510', marginBottom: '0.75rem' }}>Disqualified</h2>
        <p style={{ fontSize: '0.875rem', color: '#8a857f', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Player 1 was disqualified for tab switching (anti-cheat detected).
        </p>
        <button onClick={onClose} style={{
          width: '100%', height: 44, background: '#c83030', border: 'none', color: '#fff',
          fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '0.8rem',
          letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
        }}>Exit Arena</button>
      </div>
    </div>
  );

  /* ── Winner screen ── */
  if (winner) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(26,21,16,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,600&display=swap');`}</style>
      <div style={{ background: '#F7F3EE', border: '1px solid #ddd8d0', padding: '2.5rem', maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, background: '#1a1510', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Crown size={24} color="#F7F3EE" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 700, color: '#1a1510', marginBottom: '0.5rem' }}>Victory</h2>
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1955e6', marginBottom: '0.375rem' }}>{winner} wins!</p>
        <p style={{ fontSize: '0.875rem', color: '#8a857f', marginBottom: '1.5rem' }}>
          Completed all {testCases.length} test{testCases.length !== 1 ? 's' : ''} 🎉
        </p>
        {problem?.solution && (
          <div style={{ background: '#fff', border: '1px solid #e8e2db', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 600, color: '#8a857f', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>Solution</p>
            <pre style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1a1510', whiteSpace: 'pre-wrap', margin: 0 }}>{problem.solution}</pre>
          </div>
        )}
        <button onClick={onClose} style={{
          width: '100%', height: 44, background: '#1a1510', border: 'none', color: '#F7F3EE',
          fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '0.8rem',
          letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}>
          <Trophy size={14} /> Exit Arena
        </button>
      </div>
    </div>
  );

  /* ── Main arena ── */
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(26,21,16,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', fontFamily: "'DM Sans',sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700&family=DM+Sans:opsz,wght@9..40,400;9..40,600&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Playfair Display', Georgia, serif; }
        .code-area { font-family: 'Courier New', monospace; font-size: 0.8125rem; line-height: 1.6; resize: none; outline: none; border: none; }
        .code-area::-webkit-scrollbar { width: 4px; }
        .code-area::-webkit-scrollbar-thumb { background: #ddd8d0; }
      `}</style>

      <div style={{
        background: '#F7F3EE', border: '1px solid #ddd8d0',
        width: '100%', maxWidth: 960, maxHeight: '92vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(26,21,16,0.2)',
      }}>

        {/* Header */}
        <div style={{
          padding: '0 1.25rem', height: 52, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #ddd8d0', background: '#1a1510',
        }}>
          <div>
            <span className="f-display" style={{ fontSize: '1rem', fontWeight: 700, color: '#F7F3EE', letterSpacing: '-0.01em' }}>
              ⚔ Code Arena
            </span>
            <span style={{ fontSize: '0.75rem', color: '#5a5550', marginLeft: '0.75rem' }}>
              1v1 · {problem?.title || 'Challenge'}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F7F3EE'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b6560'}>
            <X size={16} />
          </button>
        </div>

        {/* Warning */}
        {showWarning && (
          <div style={{
            padding: '0.625rem 1.25rem', background: '#fffbeb',
            borderBottom: '1px solid #f5d87a',
            display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0,
          }}>
            <AlertCircle size={14} color="#b07020" />
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: '#b07020', margin: 0 }}>Tab switch detected</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#d09040', margin: 0 }}>One more will result in disqualification.</p>
            </div>
          </div>
        )}

        {/* Editors */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* Player 1 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #ddd8d0', overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #ddd8d0', flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#1a1510', margin: 0 }}>Player 1 — You</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: '#8a857f', margin: '0.125rem 0 0' }}>Live editable</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <TestDots passed={player1Tests} total={testCases.length} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#8a857f' }}>{player1Tests}/{testCases.length}</span>
              </div>
            </div>
            <textarea
              value={player1Code}
              onChange={e => setPlayer1Code(e.target.value)}
              onKeyDown={handleKeyDown}
              className="code-area"
              style={{ flex: 1, padding: '1rem', background: '#faf8f5', color: '#1a1510' }}
              spellCheck="false"
              autoFocus
            />
            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #ddd8d0', flexShrink: 0, background: '#fff' }}>
              <button onClick={() => runTests(player1Code, true)} disabled={timer === 0} style={{
                width: '100%', height: 36, background: '#1a1510', border: 'none', color: '#F7F3EE',
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '0.78rem',
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                opacity: timer === 0 ? 0.45 : 1, transition: 'background 0.2s',
              }}
                onMouseEnter={e => { if (timer > 0) e.currentTarget.style.background = '#2e2820'; }}
                onMouseLeave={e => e.currentTarget.style.background = '#1a1510'}>
                <Play size={12} /> Run Tests
              </button>
            </div>
          </div>

          {/* Player 2 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #ddd8d0', flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#1a1510', margin: 0 }}>Player 2 — Bot</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: '#8a857f', margin: '0.125rem 0 0' }}>Read only</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <TestDots passed={player2Tests} total={testCases.length} />
                <span style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', fontWeight: 700,
                  color: timer > 0 ? '#b07020' : '#1a7a4a',
                  padding: '0.15rem 0.5rem', border: `1px solid ${timer > 0 ? '#f5d87a' : '#a8dfc0'}`,
                  background: timer > 0 ? '#fffbeb' : '#f0faf4',
                }}>{timer > 0 ? `${timer}s` : 'done'}</span>
              </div>
            </div>
            <textarea
              value={player2Code}
              readOnly
              className="code-area"
              style={{ flex: 1, padding: '1rem', background: '#F7F3EE', color: '#6b6460' }}
              spellCheck="false"
            />
            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #ddd8d0', flexShrink: 0, background: '#fff', textAlign: 'center' }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.75rem', color: '#a0a09c', margin: 0 }}>👁 Watching live…</p>
            </div>
          </div>
        </div>

        {/* Problem details */}
        <div style={{ padding: '0 1.25rem', borderTop: '1px solid #ddd8d0', flexShrink: 0, background: '#fff' }}>
          <details>
            <summary style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: '0.8rem', fontWeight: 600,
              color: '#4a4540', letterSpacing: '0.04em', textTransform: 'uppercase',
              padding: '0.875rem 0', cursor: 'pointer', listStyle: 'none',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <ChevronRight size={13} /> Problem Details
            </summary>
            <div style={{ paddingBottom: '1.25rem' }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', color: '#4a4540', lineHeight: 1.65, marginBottom: '1rem' }}>
                {problem?.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#ddd8d0', marginBottom: '1rem' }}>
                {testCases.map((tc, i) => (
                  <div key={i} style={{ background: '#F7F3EE', padding: '0.5rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    <span style={{ color: '#1955e6', fontWeight: 600 }}>{tc.input}</span>
                    <ChevronRight size={11} color="#c0bbb5" />
                    <span style={{ color: '#1a7a4a', fontWeight: 600 }}>{tc.expected}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0.75rem 1rem', background: '#fffbeb', border: '1px solid #f5d87a' }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.8125rem', color: '#b07020', margin: 0 }}>
                  💡 <strong>Hint:</strong> Replace <code style={{ background: '#fff', padding: '0.1rem 0.375rem', fontFamily: 'monospace' }}>return 0;</code> with your solution.
                </p>
              </div>
            </div>
          </details>
        </div>

      </div>
    </div>
  );
}