"use client";

import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Text, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTerminal } from "../lib/useTerminal";

// ----------------------------------------------------
// 1. Matrix Decryption Effect Component
// ----------------------------------------------------
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

const DecryptingText = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const [display, setDisplay] = useState("");
  
  useEffect(() => {
    let iteration = 0;
    let maxIterations = Math.min(text.length, 30);
    
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
      
      iteration += 1 / 3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span className="font-mono text-emerald-400">{display}</span>;
};

// ----------------------------------------------------
// 2. 3D Background Server Rack
// ----------------------------------------------------
function BackgroundServers() {
  return (
    <>
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[2, 32, 32]} position={[4, -2, -5]}>
          <MeshDistortMaterial color="#064e3b" wireframe distort={0.3} speed={2} />
        </Sphere>
      </Float>
    </>
  );
}

// ----------------------------------------------------
// 3. Main Terminal Component
// ----------------------------------------------------
export default function ClientPortfolio({ education, experience, projects, publications, certifications, activities }: any) {
  const [matrixData, setMatrixData] = useState<any>(null);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Bundle data for the hook
  const portfolioData = { education, experience, projects, publications, certifications, activities };
  const { history, currentPath, executeCommand } = useTerminal(portfolioData, setMatrixData);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, matrixData]);

  // Handle enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    }
  };

  // Focus input anywhere clicked
  const handleWrapperClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono text-emerald-500 text-sm md:text-base selection:bg-emerald-900 selection:text-emerald-100" onClick={handleWrapperClick}>
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <BackgroundServers />
        </Canvas>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>

      {/* Terminal UI */}
      <div ref={scrollRef} className="relative z-10 w-full h-[calc(100vh-80px)] p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {history.map((cmd, idx) => (
            <div key={idx} className="space-y-2">
              {/* Command Input line */}
              {cmd.input && (
                <div className="flex gap-2 text-emerald-400">
                  <span className="font-bold">guest@{currentPath} $</span>
                  <span>{cmd.input}</span>
                </div>
              )}
              
              {/* Command Output */}
              {cmd.output && (
                <div className={`${cmd.isError ? 'text-red-400' : 'text-emerald-300'} whitespace-pre-wrap`}>
                  {Array.isArray(cmd.output) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {cmd.output.map((item: any, i: number) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.type === 'dir') {
                              executeCommand(`cd ${item.name}`);
                              executeCommand('ls');
                            } else {
                              executeCommand(`cat ${item.name}`);
                            }
                          }}
                          className={`text-left px-2 py-1 rounded hover:bg-emerald-900/50 transition-colors ${item.type === 'dir' ? 'text-blue-400 font-bold' : 'text-emerald-200'}`}
                        >
                          {item.type === 'dir' ? `[DIR] ${item.name}` : item.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    cmd.output
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Matrix Decrypted Data View */}
          <AnimatePresence>
            {matrixData && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="my-6 p-6 border border-emerald-500/30 bg-black/60 backdrop-blur-md rounded relative shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              >
                <div className="absolute top-2 right-4 text-xs opacity-50">Secure Connection Established</div>
                <h2 className="text-2xl font-bold mb-2 text-white">
                  <DecryptingText text={matrixData.title || matrixData.company || matrixData.degree} onComplete={() => {}} />
                </h2>
                {(matrixData.company || matrixData.school) && (
                  <h3 className="text-lg text-blue-400 mb-4">{matrixData.company || matrixData.school}</h3>
                )}
                
                <div className="prose prose-invert prose-emerald max-w-none mt-4">
                  <TinaMarkdown content={matrixData.body} />
                </div>
                
                <button 
                  onClick={() => setMatrixData(null)}
                  className="mt-6 px-4 py-1 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors text-sm"
                >
                  [ CLOSE CONNECTION ]
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Input Line */}
          {!matrixData && (
            <div className="flex gap-2 text-emerald-400 items-center">
              <span className="font-bold">guest@{currentPath} $</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-emerald-400 focus:ring-0 placeholder:text-emerald-900"
                placeholder="type 'help' or click the buttons below..."
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          )}
        </div>
      </div>

      {/* Non-Technical HUD (Bottom Bar) */}
      <div className="absolute bottom-0 w-full h-[80px] border-t border-emerald-900/50 bg-black/80 backdrop-blur flex items-center px-6 overflow-x-auto gap-4 z-40">
        <div className="text-xs text-emerald-700 uppercase tracking-widest mr-4 hidden md:block">Quick Access:</div>
        
        <button onClick={() => executeCommand('cd ~')} className="px-4 py-2 text-xs border border-emerald-800 rounded hover:bg-emerald-900/30 whitespace-nowrap">🏠 Home</button>
        <button onClick={() => { executeCommand('cd projects'); executeCommand('ls'); }} className="px-4 py-2 text-xs border border-emerald-800 rounded hover:bg-emerald-900/30 whitespace-nowrap">📁 Projects</button>
        <button onClick={() => { executeCommand('cd experience'); executeCommand('ls'); }} className="px-4 py-2 text-xs border border-emerald-800 rounded hover:bg-emerald-900/30 whitespace-nowrap">📁 Experience</button>
        <button onClick={() => executeCommand('cat about_me.txt')} className="px-4 py-2 text-xs border border-emerald-800 rounded hover:bg-emerald-900/30 whitespace-nowrap">📄 Read Resume</button>
        <button onClick={() => executeCommand('clear')} className="px-4 py-2 text-xs border border-emerald-800 rounded hover:bg-emerald-900/30 whitespace-nowrap ml-auto">Clear Terminal</button>
      </div>

    </div>
  );
}
