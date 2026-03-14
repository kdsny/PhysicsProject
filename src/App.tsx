import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertOctagon, Info, Gauge, Weight, Wind } from 'lucide-react';

const TRACK_LENGTH = 180;
const STOP_LINE = 150;

const TrafficLight = ({ state }: { state: string }) => (
    <div className="bg-neutral-900/80 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-neutral-800/50 flex flex-row sm:flex-col gap-2 sm:gap-3 items-center shadow-2xl">
        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ${state === 'RED' ? 'bg-rose-500 shadow-[0_0_25px_#f43f5e]' : 'bg-rose-950/30'}`} />
        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ${state === 'YELLOW' ? 'bg-amber-400 shadow-[0_0_25px_#fbbf24]' : 'bg-amber-950/30'}`} />
        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ${state === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_25px_#10b981]' : 'bg-emerald-950/30'}`} />
    </div>
);

const Road = ({ carPos, stopLine, trackLength, gameState, brakePos }: { carPos: number, stopLine: number, trackLength: number, gameState: string, brakePos: number }) => (
    <div className="relative w-full h-40 sm:h-64 bg-neutral-800 rounded-2xl overflow-hidden border-y-8 border-neutral-700 shadow-inner">
        {/* Road texture/markings */}
        <div className="absolute top-1/2 w-full border-t-8 border-dashed border-neutral-600/50 -translate-y-1/2" />
        
        {/* Distance markers */}
        {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="absolute bottom-0 text-neutral-500 text-[10px] sm:text-xs font-mono px-1 border-l border-neutral-600/50" style={{ left: `${(i * 20 / trackLength) * 100}%` }}>
                {i * 20}m
            </div>
        ))}

        {/* Stop Line */}
        <div 
            className="absolute top-0 bottom-0 w-4 sm:w-6 bg-white/90 z-10 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
            style={{ left: `${(stopLine / trackLength) * 100}%` }}
        >
            <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 text-neutral-900 font-black whitespace-nowrap bg-white px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-sm shadow-md">STOP</div>
        </div>
        
        {/* Skid marks */}
        {(gameState === 'BRAKING' || gameState === 'FINISHED') && brakePos > 0 && (
            <div 
                className="absolute top-1/2 h-6 sm:h-10 bg-neutral-950/60 -translate-y-1/2 z-10 rounded-full blur-[1px] sm:blur-[2px]"
                style={{ 
                    left: `${(brakePos / trackLength) * 100}%`, 
                    width: `${Math.max(0, (carPos - brakePos) / trackLength) * 100}%` 
                }}
            />
        )}

        {/* Car */}
        <div 
            className="absolute top-1/2 -translate-y-1/2 z-20 transition-transform duration-75"
            style={{ left: `${(carPos / trackLength) * 100}%`, transform: 'translate(-100%, -50%)' }}
        >
            <div className="w-24 h-12 sm:w-32 sm:h-16 relative flex items-center justify-center drop-shadow-2xl">
                {/* Wheels */}
                <div className="absolute top-0 left-4 w-4 sm:w-5 h-1.5 sm:h-2 bg-neutral-950 rounded-sm" />
                <div className="absolute bottom-0 left-4 w-4 sm:w-5 h-1.5 sm:h-2 bg-neutral-950 rounded-sm" />
                <div className="absolute top-0 right-5 w-4 sm:w-5 h-1.5 sm:h-2 bg-neutral-950 rounded-sm" />
                <div className="absolute bottom-0 right-5 w-4 sm:w-5 h-1.5 sm:h-2 bg-neutral-950 rounded-sm" />

                {/* Main Chassis */}
                <div className="absolute inset-y-1 left-1 right-2 bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-[16px] sm:rounded-[20px] shadow-inner border border-red-800/50 overflow-hidden">
                    {/* Racing Stripe */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 sm:h-2 bg-white/90 shadow-sm" />
                </div>

                {/* Front Hood/Nose (tapered) */}
                <div className="absolute right-0 inset-y-2.5 sm:inset-y-3 w-6 sm:w-8 bg-gradient-to-r from-red-500 to-red-400 rounded-r-full shadow-inner border-r border-y border-red-400/30" />

                {/* Cabin / Glass area */}
                <div className="absolute left-6 right-8 inset-y-1.5 sm:inset-y-2 bg-neutral-900 rounded-[10px] sm:rounded-[14px] border border-neutral-700 overflow-hidden shadow-2xl">
                    {/* Roof */}
                    <div className="absolute inset-1 sm:inset-1.5 bg-gradient-to-r from-red-700 to-red-600 rounded-[4px] sm:rounded-[6px] shadow-sm border border-red-500/30">
                         {/* Roof stripe */}
                         <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 sm:h-1.5 bg-white/90" />
                    </div>
                    {/* Windshield reflection */}
                    <div className="absolute right-0 top-0 bottom-0 w-2 sm:w-3 bg-gradient-to-r from-sky-400/40 to-transparent" />
                    {/* Rear window reflection */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-2 bg-gradient-to-l from-sky-400/20 to-transparent" />
                </div>

                {/* Side Mirrors */}
                <div className="absolute right-10 top-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-t-sm shadow-md" />
                <div className="absolute right-10 bottom-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-600 rounded-b-sm shadow-md" />

                {/* Spoiler */}
                <div className="absolute left-0 inset-y-2 w-2.5 sm:w-3 bg-neutral-900 rounded-l-md shadow-lg border border-neutral-700 flex flex-col justify-between py-0.5 sm:py-1 z-10">
                    <div className="w-full h-0.5 bg-red-500/50" />
                    <div className="w-full h-0.5 bg-red-500/50" />
                </div>

                {/* Headlights */}
                <div className="absolute right-0.5 top-3 sm:top-3.5 w-1.5 h-2 sm:w-2 sm:h-2.5 bg-yellow-100 rounded-full shadow-[4px_0_15px_#fef08a] z-10" />
                <div className="absolute right-0.5 bottom-3 sm:bottom-3.5 w-1.5 h-2 sm:w-2 sm:h-2.5 bg-yellow-100 rounded-full shadow-[4px_0_15px_#fef08a] z-10" />
                
                {/* Taillights */}
                <div className={`absolute left-0.5 top-2 sm:top-2.5 w-1.5 h-2 sm:w-2 sm:h-3 rounded-sm transition-colors z-10 ${gameState === 'BRAKING' || gameState === 'FINISHED' ? 'bg-rose-500 shadow-[-8px_0_20px_#f43f5e]' : 'bg-rose-900'}`} />
                <div className={`absolute left-0.5 bottom-2 sm:bottom-2.5 w-1.5 h-2 sm:w-2 sm:h-3 rounded-sm transition-colors z-10 ${gameState === 'BRAKING' || gameState === 'FINISHED' ? 'bg-rose-500 shadow-[-8px_0_20px_#f43f5e]' : 'bg-rose-900'}`} />
            </div>
        </div>
    </div>
);

export default function App() {
    const [gameState, setGameState] = useState('SETUP'); // SETUP, DRIVING, BRAKING, FINISHED
    const [speed, setSpeed] = useState(25); // m/s
    const [mass, setMass] = useState(1500); // kg
    const [deceleration, setDeceleration] = useState(8); // m/s^2
    
    const [carPos, setCarPos] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [lightState, setLightState] = useState('GREEN');
    
    const [results, setResults] = useState<any>(null);

    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const stateRef = useRef({
        pos: 0,
        vel: 0,
        state: 'SETUP',
        light: 'GREEN',
        redLightPos: 0,
        yellowLightPos: 0,
        redLightTime: 0,
        brakeTime: 0,
        brakePos: 0,
        stopLine: STOP_LINE,
        idealReactionTime: 0.5
    });

    const calculateResults = () => {
        const { pos, redLightTime, brakeTime, stopLine, vel, idealReactionTime } = stateRef.current;
        
        let reactionTime = -1;
        if (brakeTime > 0 && redLightTime > 0 && brakeTime >= redLightTime) {
            reactionTime = (brakeTime - redLightTime) / 1000;
        }
        
        const distanceToLine = stopLine - pos;
        
        const kineticEnergy = 0.5 * mass * speed * speed;
        const brakingForce = mass * deceleration;
        const brakingDistance = (speed * speed) / (2 * deceleration);
        const workDone = brakingForce * brakingDistance;
        
        setResults({
            reactionTime,
            idealReactionTime,
            distanceToLine,
            kineticEnergy,
            brakingForce,
            brakingDistance,
            workDone,
            crashed: pos > TRACK_LENGTH && vel > 0
        });
    };

    const update = (time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = (time - previousTimeRef.current) / 1000;
            let { pos, vel, state, light, redLightPos, yellowLightPos } = stateRef.current;

            if (state === 'DRIVING' || state === 'BRAKING') {
                if (state === 'DRIVING') {
                    pos += vel * deltaTime;
                    
                    if (light === 'GREEN' && pos >= yellowLightPos) {
                        stateRef.current.light = 'YELLOW';
                        setLightState('YELLOW');
                    } else if (light === 'YELLOW' && pos >= redLightPos) {
                        stateRef.current.light = 'RED';
                        stateRef.current.redLightTime = performance.now();
                        setLightState('RED');
                    }
                } else if (state === 'BRAKING') {
                    vel -= deceleration * deltaTime;
                    if (vel <= 0) {
                        vel = 0;
                        stateRef.current.state = 'FINISHED';
                        setGameState('FINISHED');
                        calculateResults();
                    }
                    pos += vel * deltaTime;
                }
                
                if (pos > TRACK_LENGTH + 20) {
                    stateRef.current.state = 'FINISHED';
                    setGameState('FINISHED');
                    calculateResults();
                }

                stateRef.current.pos = pos;
                stateRef.current.vel = vel;
                setCarPos(pos);
                setCurrentSpeed(vel);
            }
        }
        previousTimeRef.current = time;
        if (stateRef.current.state === 'DRIVING' || stateRef.current.state === 'BRAKING') {
            requestRef.current = requestAnimationFrame(update);
        }
    };

    const startGame = () => {
        const idealReactionTime = 0.4 + Math.random() * 0.4;
        const brakingDist = (speed * speed) / (2 * deceleration);
        const reactionDist = speed * idealReactionTime;
        const totalDist = brakingDist + reactionDist;
        const redLightPos = STOP_LINE - totalDist;
        const yellowLightPos = redLightPos - (speed * 1.5); // 1.5 seconds before red
        
        stateRef.current = {
            pos: 0,
            vel: speed,
            state: 'DRIVING',
            light: 'GREEN',
            redLightPos,
            yellowLightPos,
            redLightTime: 0,
            brakeTime: 0,
            brakePos: 0,
            stopLine: STOP_LINE,
            idealReactionTime
        };
        
        setGameState('DRIVING');
        setLightState('GREEN');
        setCarPos(0);
        setCurrentSpeed(speed);
        setResults(null);
        
        previousTimeRef.current = undefined;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(update);
    };

    const handleBrake = () => {
        if (stateRef.current.state === 'DRIVING') {
            stateRef.current.state = 'BRAKING';
            stateRef.current.brakeTime = performance.now();
            stateRef.current.brakePos = stateRef.current.pos;
            setGameState('BRAKING');
        }
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500/30">
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-800/60 pb-4 sm:pb-6 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                            <AlertOctagon className="text-rose-500" size={28} />
                            Physics Braking Simulator
                        </h1>
                        <p className="text-neutral-400 mt-1 sm:mt-2 text-sm sm:text-base">Test your reaction time and learn the physics of stopping a vehicle.</p>
                    </div>
                </header>

                {/* Settings Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-neutral-900/50 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-neutral-800/50 shadow-lg hover:border-neutral-700/50 transition-colors">
                        <label className="text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3 sm:mb-4">
                            <Gauge size={16} className="text-indigo-400"/> Initial Speed
                        </label>
                        <input 
                            type="range" min="10" max="40" value={speed} 
                            onChange={e => setSpeed(Number(e.target.value))} 
                            className="w-full accent-indigo-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer" 
                            disabled={gameState !== 'SETUP' && gameState !== 'FINISHED'} 
                        />
                        <div className="mt-2 sm:mt-3 flex justify-between items-end">
                            <span className="text-xs sm:text-sm text-neutral-500 font-mono">{(speed * 3.6).toFixed(0)} km/h</span>
                            <span className="font-mono text-xl sm:text-2xl text-white">{speed} <span className="text-xs sm:text-sm text-neutral-500">m/s</span></span>
                        </div>
                    </div>
                    
                    <div className="bg-neutral-900/50 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-neutral-800/50 shadow-lg hover:border-neutral-700/50 transition-colors">
                        <label className="text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3 sm:mb-4">
                            <Weight size={16} className="text-emerald-400"/> Car Mass
                        </label>
                        <input 
                            type="range" min="800" max="3000" step="100" value={mass} 
                            onChange={e => setMass(Number(e.target.value))} 
                            className="w-full accent-emerald-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer" 
                            disabled={gameState !== 'SETUP' && gameState !== 'FINISHED'} 
                        />
                        <div className="mt-2 sm:mt-3 flex justify-between items-end">
                            <span className="text-xs sm:text-sm text-neutral-500 font-mono">Weight</span>
                            <span className="font-mono text-xl sm:text-2xl text-white">{mass} <span className="text-xs sm:text-sm text-neutral-500">kg</span></span>
                        </div>
                    </div>
                    
                    <div className="bg-neutral-900/50 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-neutral-800/50 shadow-lg hover:border-neutral-700/50 transition-colors">
                        <label className="text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 mb-3 sm:mb-4">
                            <Wind size={16} className="text-amber-400"/> Braking Deceleration
                        </label>
                        <input 
                            type="range" min="4" max="12" step="0.5" value={deceleration} 
                            onChange={e => setDeceleration(Number(e.target.value))} 
                            className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer" 
                            disabled={gameState !== 'SETUP' && gameState !== 'FINISHED'} 
                        />
                        <div className="mt-2 sm:mt-3 flex justify-between items-end">
                            <span className="text-xs sm:text-sm text-neutral-500 font-mono">Friction</span>
                            <span className="font-mono text-xl sm:text-2xl text-white">{deceleration} <span className="text-xs sm:text-sm text-neutral-500">m/s²</span></span>
                        </div>
                    </div>
                </div>

                {/* Main Simulation Area */}
                <div className="bg-neutral-900/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-neutral-800/60 shadow-2xl">
                    {/* Dashboard & Traffic Light */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-4 sm:gap-0">
                        <TrafficLight state={lightState} />
                        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="flex-1 sm:flex-none bg-neutral-950/80 border border-neutral-800/50 rounded-2xl p-3 sm:p-5 min-w-[120px] sm:min-w-[140px] shadow-inner">
                                <div className="text-neutral-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1">Speed</div>
                                <div className="text-2xl sm:text-4xl font-mono text-white">{(currentSpeed * 3.6).toFixed(0)} <span className="text-sm sm:text-xl text-neutral-600">km/h</span></div>
                            </div>
                            <div className="flex-1 sm:flex-none bg-neutral-950/80 border border-neutral-800/50 rounded-2xl p-3 sm:p-5 min-w-[120px] sm:min-w-[140px] shadow-inner">
                                <div className="text-neutral-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1">Distance to Line</div>
                                <div className="text-2xl sm:text-4xl font-mono text-white">{Math.max(0, STOP_LINE - carPos).toFixed(1)} <span className="text-sm sm:text-xl text-neutral-600">m</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Road */}
                    <Road carPos={carPos} stopLine={STOP_LINE} trackLength={TRACK_LENGTH} gameState={gameState} brakePos={stateRef.current.brakePos} />

                    {/* Controls */}
                    <div className="mt-6 sm:mt-8 flex gap-4">
                        {gameState === 'SETUP' || gameState === 'FINISHED' ? (
                            <button 
                                onClick={startGame}
                                className="flex-1 py-4 sm:py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-[0_4px_0_#047857] sm:shadow-[0_6px_0_#047857] active:shadow-[0_0px_0_#047857] active:translate-y-[4px] sm:active:translate-y-[6px]"
                            >
                                {gameState === 'FINISHED' ? <RotateCcw size={24} className="sm:w-7 sm:h-7" /> : <Play size={24} className="sm:w-7 sm:h-7" />}
                                {gameState === 'FINISHED' ? 'TRY AGAIN' : 'START SIMULATION'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleBrake}
                                className="flex-1 py-6 sm:py-8 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-4xl sm:text-5xl font-black tracking-widest shadow-[0_6px_0_#be123c] sm:shadow-[0_10px_0_#be123c] active:shadow-[0_0px_0_#be123c] active:translate-y-[6px] sm:active:translate-y-[10px] transition-all"
                            >
                                BRAKE!
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Modal / Section */}
                {gameState === 'FINISHED' && results && (
                    <div className="bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-800/60 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-neutral-950/50 p-5 sm:p-6 border-b border-neutral-800/60 flex items-center gap-4">
                            <div className="p-2 sm:p-3 bg-indigo-500/20 rounded-xl">
                                <Info className="text-indigo-400" size={24} className="sm:w-7 sm:h-7" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">Physics Analysis</h2>
                                <p className="text-neutral-400 text-xs sm:text-sm">Breakdown of your stopping performance</p>
                            </div>
                        </div>
                        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                            {/* Performance */}
                            <div className="space-y-4 sm:space-y-6">
                                <h3 className="text-base sm:text-lg font-bold text-neutral-300 uppercase tracking-wider border-b border-neutral-800/60 pb-2 sm:pb-3">Your Performance</h3>
                                
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex justify-between items-center p-3 sm:p-4 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                                        <span className="text-sm sm:text-base text-neutral-400">Target Reaction Time:</span>
                                        <span className="font-mono text-lg sm:text-xl text-white">{results.idealReactionTime.toFixed(3)} s</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 sm:p-4 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                                        <span className="text-sm sm:text-base text-neutral-400">Your Reaction Time:</span>
                                        <span className={`font-mono text-xl sm:text-2xl font-bold ${
                                            results.reactionTime < 0 ? 'text-rose-500' : 
                                            Math.abs(results.reactionTime - results.idealReactionTime) < 0.1 ? 'text-emerald-400' : 
                                            'text-amber-400'
                                        }`}>
                                            {results.reactionTime > 0 ? `${results.reactionTime.toFixed(3)} s` : 'Early / Missed'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 sm:p-4 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                                        <span className="text-sm sm:text-base text-neutral-400">Stopping Position:</span>
                                        <span className={`font-mono text-lg sm:text-2xl font-bold ${
                                            Math.abs(results.distanceToLine) < 1 ? 'text-emerald-400' : 
                                            results.distanceToLine < 0 ? 'text-rose-500' : 
                                            'text-amber-400'
                                        }`}>
                                            {results.distanceToLine > 0 ? `${results.distanceToLine.toFixed(2)}m before line` : 
                                             results.distanceToLine < 0 ? `${Math.abs(results.distanceToLine).toFixed(2)}m past line` : 
                                             'Perfect Stop!'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Physics Calculations */}
                            <div className="space-y-4 sm:space-y-6">
                                <h3 className="text-base sm:text-lg font-bold text-neutral-300 uppercase tracking-wider border-b border-neutral-800/60 pb-2 sm:pb-3">Physics Calculations</h3>
                                
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex justify-between items-center p-2 sm:p-3 hover:bg-neutral-800/30 rounded-lg transition-colors">
                                        <span className="text-sm sm:text-base text-neutral-400 flex items-center gap-2">Initial Kinetic Energy <span className="hidden sm:inline-block text-[10px] sm:text-xs font-mono bg-neutral-800/80 px-2 py-1 rounded text-neutral-300">½mv²</span></span>
                                        <span className="font-mono text-base sm:text-lg text-white">{(results.kineticEnergy / 1000).toFixed(1)} kJ</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-2 sm:p-3 hover:bg-neutral-800/30 rounded-lg transition-colors">
                                        <span className="text-sm sm:text-base text-neutral-400 flex items-center gap-2">Braking Force <span className="hidden sm:inline-block text-[10px] sm:text-xs font-mono bg-neutral-800/80 px-2 py-1 rounded text-neutral-300">ma</span></span>
                                        <span className="font-mono text-base sm:text-lg text-white">{(results.brakingForce / 1000).toFixed(1)} kN</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-2 sm:p-3 hover:bg-neutral-800/30 rounded-lg transition-colors">
                                        <span className="text-sm sm:text-base text-neutral-400 flex items-center gap-2">Min Braking Distance <span className="hidden sm:inline-block text-[10px] sm:text-xs font-mono bg-neutral-800/80 px-2 py-1 rounded text-neutral-300">v²/2a</span></span>
                                        <span className="font-mono text-base sm:text-lg text-white">{results.brakingDistance.toFixed(2)} m</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-2 sm:p-3 hover:bg-neutral-800/30 rounded-lg transition-colors">
                                        <span className="text-sm sm:text-base text-neutral-400 flex items-center gap-2">Work Done by Brakes <span className="hidden sm:inline-block text-[10px] sm:text-xs font-mono bg-neutral-800/80 px-2 py-1 rounded text-neutral-300">F×d</span></span>
                                        <span className="font-mono text-base sm:text-lg text-white">{(results.workDone / 1000).toFixed(1)} kJ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
