import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Play, AlertCircle, Trophy, Zap, Crown, ChevronRight } from 'lucide-react';

export default function CodeArena({ onClose, problem }) {
  const [player1Code, setPlayer1Code] = useState('// Player 1: Solve sumTwoNumbers\nfunction sumTwoNumbers(a, b) {\n  // Write your solution here\n  return 0;\n}');
  const [player2Code, setPlayer2Code] = useState('');
  const [player1Tests, setPlayer1Tests] = useState(0);
  const [player2Tests, setPlayer2Tests] = useState(0);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(15);
  const [tabSwitches, setTabSwitches] = useState({ p1: 0 });
  const [showWarning, setShowWarning] = useState(false);
  const [disqualified, setDisqualified] = useState(null);
  const timerRef = useRef();

  // Reset on new problem
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
      setPlayer1Tests(0);
      setPlayer2Tests(0);
      setWinner(null);
      setShowWarning(false);
      setTabSwitches({ p1: 0 });
      setDisqualified(null);
    }
  }, [problem]);

  const testCases = problem?.testCases || [];

  // Anti-cheat tab switch detection
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

  // Timer effect
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
        if (normalize(code).includes(normalize(problem.solution)) || 
            normalize(problem.solution).includes(normalize(code))) {
          if (isPlayer1) {
            setPlayer1Tests(testCases.length);
            setWinner('Player 1');
          } else {
            setPlayer2Tests(testCases.length);
            setWinner('Player 2');
          }
          return;
        }
      } catch (e) {}
    }

    let fnName = null, fnParams = '';
    if (problem?.starterCode) {
      const sigMatch = problem.starterCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
      if (sigMatch) {
        fnName = sigMatch[1];
        fnParams = sigMatch[2];
      }
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
        if (argsRaw) {
          args = (new Function(`return [${argsRaw}]`))();
        }

        let result;
        if (userFn && callMatch[1] === fnName) {
          result = userFn(...args);
        } else {
          result = eval(tc.input);
        }

        if (result === tc.expected) passedTests++;
      } catch (e) {}
    });

    if (isPlayer1) {
      setPlayer1Tests(passedTests);
      if (passedTests === testCases.length) setWinner('Player 1');
    } else {
      setPlayer2Tests(passedTests);
      if (passedTests === testCases.length) setWinner('Player 2');
    }
  }, [problem, testCases]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setPlayer1Code(prev => 
        prev.substring(0, start) + '  ' + prev.substring(end)
      );
      e.target.selectionStart = e.target.selectionEnd = start + 2;
    }
  }, []);

  const TestIndicator = ({ passed, total }) => (
    <div className="flex gap-1 p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
            i < passed 
              ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-md shadow-emerald-500/25 scale-110' 
              : 'bg-gradient-to-r from-slate-400 to-slate-500 shadow-md shadow-slate-500/25'
          }`}
        />
      ))}
    </div>
  );

  if (disqualified) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-500/20 via-black/80 to-blue-950/90 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/50 rounded-2xl p-8 text-center max-w-sm mx-4 animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 backdrop-blur-sm shadow-xl shadow-red-500/25">
              <AlertCircle className="h-8 w-8 text-red-400 drop-shadow-lg" />
            </div>
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent mb-4 tracking-tight">
            DISQUALIFIED
          </h2>
          <p className="text-base text-slate-300/90 mb-8 font-medium leading-relaxed max-w-sm mx-auto">
            Player 1 disqualified for cheating (tab switch detected).
          </p>
          <button
            onClick={onClose}
            className="group w-full px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold text-base shadow-xl shadow-red-500/50 hover:shadow-red-500/75 hover:scale-[1.02] transition-all duration-300 hover:from-red-600 hover:to-rose-600"
          >
            Exit Arena
          </button>
        </div>
      </div>
    );
  }

  if (winner) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/30 via-black/80 to-cyan-500/20 flex items-center justify-center z-50 backdrop-blur-md animate-pulse">
        <div className="bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/50 rounded-2xl p-8 text-center max-w-md mx-4 animate-in zoom-in-95 fade-in duration-700">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center border-4 border-emerald-400/50 backdrop-blur-lg shadow-xl shadow-emerald-500/40 animate-bounce">
              <Crown className="h-10 w-10 text-emerald-400 drop-shadow-xl" />
            </div>
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent mb-4 tracking-tight">
            VICTORY!
          </h2>
          <p className="text-xl font-bold text-emerald-400 mb-4 drop-shadow-lg animate-pulse">{winner} Wins!</p>
          <p className="text-lg text-slate-300/90 mb-6 font-medium">Completed all {testCases.length} tests 🎉</p>
          {problem?.solution && (
            <div className="mb-6 p-4 bg-black/20 rounded-xl text-left font-mono text-sm text-emerald-300 border border-emerald-500/30 backdrop-blur-xl">
              <strong className="text-lg block mb-2">Solution:</strong>
              <pre className="whitespace-pre-wrap text-emerald-200 text-xs">{problem.solution}</pre>
            </div>
          )}
          <button
            onClick={onClose}
            className="group w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold text-base shadow-xl shadow-emerald-500/50 hover:shadow-emerald-500/75 hover:scale-[1.02] transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600"
          >
            <span className="flex items-center justify-center gap-2">
              <Trophy className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              Exit Arena
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white/3 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col hover:shadow-blue-500/30 transition-all duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-950 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent tracking-tight">
              ⚔️ Code Arena
            </h2>
            <p className="text-sm text-slate-300/90 mt-1 font-medium tracking-wide">
              1v1 Battle • {problem?.title || 'Challenge'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="group p-2 hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-md border border-white/20 shadow-lg shadow-black/30 hover:shadow-cyan-500/30"
          >
            <X className="h-5 w-5 text-slate-300 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Warning Banner */}
        {showWarning && (
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-400/40 px-6 py-3 flex items-center gap-3 text-amber-100 backdrop-blur-md animate-in slide-in-from-top-2">
            <div className="p-1.5 bg-amber-500/20 rounded-xl border border-amber-400/50 backdrop-blur-sm shadow-lg shadow-amber-500/25">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base tracking-wide">⚠️ Tab Switch Detected</p>
              <p className="text-xs opacity-90 font-medium">One more = disqualification!</p>
            </div>
          </div>
        )}

        {/* Dual Editors */}
        <div className="flex-1 overflow-hidden flex bg-gradient-to-b from-slate-900/30 to-blue-950/20 min-h-0">
          {/* Player 1 */}
          <div className="flex-1 flex flex-col border-r border-white/10 relative overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 border-b border-emerald-400/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-400/30 backdrop-blur-sm">
                    <Zap className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Player 1 (You)</h3>
                    <p className="text-xs text-emerald-300/90 font-medium">Live Editable</p>
                  </div>
                </div>
                <TestIndicator passed={player1Tests} total={testCases.length} />
              </div>
              <div className="text-xs font-mono text-emerald-300/80 bg-black/40 px-3 py-1 rounded-full inline-block">
                {player1Tests}/{testCases.length} Tests
              </div>
            </div>

            <div className="relative flex-1 min-h-0">
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-b from-slate-900/70 to-blue-950/70 backdrop-blur-sm border-r border-white/10 text-right pr-2 pt-3 text-xs font-mono text-slate-400 z-10 pointer-events-none">
                {player1Code.split('\n').map((_, i) => (
                  <div key={i} className="h-6 leading-6 select-none">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={player1Code}
                onChange={e => setPlayer1Code(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full pl-12 p-4 bg-black/50 backdrop-blur-2xl text-white font-mono text-sm resize-none focus:outline-none border-0 caret-emerald-400 selection:bg-emerald-500/30 leading-[1.5]"
                spellCheck="false"
                autoFocus
              />
            </div>

            <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-black/70 to-transparent backdrop-blur-xl">
              <button
                onClick={() => runTests(player1Code, true)}
                disabled={timer === 0}
                className="group flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-xl shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-[1.02] transition-all duration-300 hover:from-emerald-600 hover:via-cyan-600 hover:to-emerald-700 backdrop-blur-xl border border-emerald-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                Test Code
              </button>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-800/40 via-blue-900/20 to-slate-900/30 border-b border-blue-400/20 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-slate-500/30 to-blue-500/30 rounded-xl border border-slate-400/40 backdrop-blur-sm">
                    <Zap className="h-4 w-4 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Player 2 (Bot)</h3>
                    <p className="text-xs text-slate-300/90 font-medium">Read-Only</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <TestIndicator passed={player2Tests} total={testCases.length} />
                  <div className={`px-3 py-1 rounded-xl text-xs font-bold backdrop-blur-sm border shadow-md transition-all duration-300 ${
                    timer > 0 
                      ? 'bg-gradient-to-r from-orange-500/50 to-red-500/50 text-orange-100 border-orange-400/60 animate-pulse shadow-orange-500/40' 
                      : 'bg-gradient-to-r from-emerald-500/50 to-cyan-500/50 text-emerald-100 border-emerald-400/60 shadow-emerald-500/40'
                  }`}>
                    {timer > 0 ? `${timer}s` : 'done'}
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400/90 bg-slate-900/70 px-3 py-1 rounded-full inline-block">
                {player2Tests}/{testCases.length} Tests
              </div>
            </div>

            <div className="relative flex-1 min-h-0">
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-b from-blue-950/80 to-slate-950/80 backdrop-blur-sm border-r border-white/10 text-right pr-2 pt-3 text-xs font-mono text-slate-500 z-10 pointer-events-none">
                {player2Code.split('\n').map((_, i) => (
                  <div key={i} className="h-6 leading-6 select-none">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={player2Code}
                readOnly
                className="w-full h-full pl-12 p-4 bg-slate-950/70 backdrop-blur-2xl text-slate-300 font-mono text-sm resize-none focus:outline-none border-0 opacity-95 selection:bg-blue-500/40 leading-[1.5]"
                spellCheck="false"
              />
            </div>

            <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-slate-900/80 to-transparent backdrop-blur-xl">
              <p className="text-sm text-slate-400 text-center font-semibold backdrop-blur-sm bg-black/50 px-4 py-2 rounded-xl inline-block shadow-lg shadow-black/30">
                👁️ Watching live...
              </p>
            </div>
          </div>
        </div>

        {/* Problem Details */}
        <div className="px-6 py-4 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-2xl border-t border-white/10">
          <details className="cursor-pointer group">
            <summary className="font-bold text-base text-white/95 hover:text-cyan-300 transition-all duration-300 flex items-center gap-2 group-hover:scale-105 p-1.5 rounded-xl hover:bg-white/5 backdrop-blur-sm">
              📝 Problem Details
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping" />
              <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform duration-300 ml-auto" />
            </summary>
            <div className="mt-4 p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl shadow-black/40">
              <p className="text-slate-300 mb-4 text-sm font-medium leading-relaxed">
                {problem?.description}
              </p>
              <div className="p-4 bg-gradient-to-br from-slate-900/70 to-blue-950/50 rounded-2xl border border-slate-700/50 backdrop-blur-xl mb-4 shadow-xl shadow-slate-900/50">
                <div className="text-xs font-mono text-emerald-300/90 space-y-2">
                  {testCases.map((tc, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-black/30 rounded-xl backdrop-blur-sm border border-emerald-500/20 text-xs">
                      <span className="font-bold text-emerald-400 min-w-[50px]">{tc.input}</span>
                      <ChevronRight className="h-3 w-3 text-slate-500 flex-shrink-0" />
                      <span className="font-bold text-emerald-400">{tc.expected}</span>
                      <span className="ml-auto text-emerald-500 font-semibold">✓</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-500/15 to-orange-500/15 rounded-2xl border border-amber-400/40 backdrop-blur-xl shadow-xl shadow-amber-500/30">
                <p className="text-sm text-amber-300 font-semibold">
                  💡 <strong>Hint:</strong> Replace <code className="bg-black/60 px-2 py-0.5 rounded-lg text-amber-200 font-mono text-xs ml-1">return 0;</code> with your solution!
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
