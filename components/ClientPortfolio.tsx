"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Float, Stars, Sparkles, Icosahedron, TorusKnot, Sphere } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { TinaMarkdown } from "tinacms/dist/rich-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Minimalist, premium trailing cursor
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (target.closest('.cursor-pointer') || target.tagName.toLowerCase() === 'button') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-gray-400 pointer-events-none z-[100] flex items-center justify-center mix-blend-difference hidden md:flex"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 4 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.1 }}
      />
    </>
  );
};

// Elegant "Frosted Glass" 3D Architecture Scene
function SceneModels() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const floatersRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current || !floatersRef.current) return;

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      onUpdate: (self) => {
        if (groupRef.current) {
          groupRef.current.rotation.y = self.progress * Math.PI * 2;
          groupRef.current.rotation.x = self.progress * Math.PI;
          groupRef.current.position.y = Math.sin(self.progress * Math.PI) * 1.5;
        }
        if (floatersRef.current) {
          floatersRef.current.rotation.y = -(self.progress * Math.PI * 1);
          floatersRef.current.position.y = self.progress * 4;
        }
        
        camera.position.z = 6 + Math.sin(self.progress * Math.PI) * 2;
        camera.position.x = Math.sin(self.progress * Math.PI * 2) * 1.5;
        camera.lookAt(0, 0, 0);
      }
    });

    return () => st.kill();
  }, [camera]);

  const floaters = Array.from({ length: 25 }).map((_, i) => ({
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ] as [number, number, number],
    scale: Math.random() * 0.3 + 0.1,
  }));

  const glassProps = {
    transmission: 0.9,
    opacity: 1,
    metalness: 0,
    roughness: 0.1,
    ior: 1.5,
    thickness: 2,
    specularIntensity: 1,
    clearcoat: 1,
    transparent: true,
  };

  return (
    <>
      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
          <Icosahedron args={[1.5, 0]} position={[-2, 1, -1]}>
            <meshPhysicalMaterial {...glassProps} color="#ffffff" />
          </Icosahedron>
        </Float>
        
        <Float speed={1} rotationIntensity={1.5} floatIntensity={1}>
          <TorusKnot args={[1.2, 0.3, 100, 16]} position={[2.5, -1, -2]}>
            <meshPhysicalMaterial {...glassProps} color="#ffffff" />
          </TorusKnot>
        </Float>
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
          <Sphere args={[1.2, 64, 64]} position={[0, 2.5, -4]}>
            <meshPhysicalMaterial {...glassProps} color="#ffffff" roughness={0.3} />
          </Sphere>
        </Float>
      </group>

      <group ref={floatersRef}>
        {floaters.map((flt, i) => (
          <Float key={i} speed={Math.random() * 2} rotationIntensity={1} floatIntensity={Math.random() * 2}>
            <mesh position={flt.position} scale={flt.scale}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshPhysicalMaterial {...glassProps} color="#ffffff" transmission={0.6} roughness={0.4} />
            </mesh>
          </Float>
        ))}
      </group>
    </>
  );
}

// Sophisticated, clean Modal Design with Massive Blur
const Modal = ({ selectedItem, onClose }: { selectedItem: any, onClose: () => void }) => {
  if (!selectedItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(30px)" }} // Heavy Blur for readability
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 cursor-pointer"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden bg-[#0a0a0a]/90 backdrop-blur-[60px] border border-white/20 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] cursor-auto"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Header */}
          <div className="relative border-b border-white/20 p-8 md:p-10 flex items-start justify-between bg-white/5">
            <div>
              <p className="text-gray-300 text-sm font-semibold tracking-[0.2em] uppercase mb-2 flex items-center">
                Detailed Insight
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                {selectedItem.title || selectedItem.degree}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-colors border border-white/10"
            >
              <span className="text-xl font-bold">✕</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="relative p-8 md:p-10 overflow-y-auto max-h-[calc(85vh-160px)] custom-scrollbar">
            <h3 className="text-xl md:text-2xl text-emerald-300 font-semibold mb-2">
              {selectedItem.company || selectedItem.institution || selectedItem.issuer}
            </h3>
            
            {(selectedItem.startDate || selectedItem.endDate) && (
              <div className="text-gray-400 font-mono text-sm mb-10 font-medium">
                {selectedItem.startDate} {selectedItem.endDate ? `— ${selectedItem.endDate}` : ""}
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="prose prose-invert prose-lg max-w-none prose-p:text-gray-200 prose-p:font-medium prose-p:leading-relaxed prose-li:text-gray-200 prose-li:font-medium prose-strong:font-bold prose-strong:text-white"
            >
              {selectedItem.body ? (
                <TinaMarkdown content={selectedItem.body} />
              ) : (
                <div className="text-gray-400 font-medium italic">
                  No additional information provided.
                </div>
              )}
            </motion.div>
          </div>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Premium Interactive Card Component with Thickened Blur
const GlassCard = ({ item, onClick, category, isList = false }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (isList) {
    return (
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ x: category === 'Activities' ? -10 : 10 }}
        onClick={onClick}
        className="cursor-pointer relative overflow-hidden mb-4 p-6 bg-[#0a0a0a]/80 backdrop-blur-[40px] border border-white/20 rounded-2xl transition-all hover:border-white/40 group shadow-lg"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0, background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.1), transparent 40%)` }}
        />
        <div className="relative z-10 flex justify-between items-center">
          <h4 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">{item.title || item.degree}</h4>
          <span className="text-gray-300 font-mono text-xs uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Read</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer relative overflow-hidden p-8 md:p-10 bg-[#0a0a0a]/80 backdrop-blur-[40px] border border-white/20 rounded-3xl group shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
    >
      {/* Interactive Spotlight */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{ opacity: isHovered ? 1 : 0, background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.12), transparent 40%)` }}
      />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{item.title || item.degree}</h3>
          <h4 className="text-lg text-emerald-300 font-medium">{item.company || item.institution || item.issuer}</h4>
        </div>
        
        <div className="mt-12 flex justify-between items-end border-t border-white/20 pt-6">
          {(item.startDate || item.endDate) ? (
            <div className="text-gray-300 font-mono text-sm font-semibold tracking-widest uppercase">
              {item.startDate} {item.endDate ? `— ${item.endDate}` : ""}
            </div>
          ) : <div />}
          <div className="text-white group-hover:text-emerald-400 transition-colors font-bold text-sm uppercase tracking-widest flex items-center bg-white/10 px-4 py-2 rounded-full border border-white/10 group-hover:border-emerald-400">
            Explore <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ClientPortfolio({ education, experience, projects, publications, certifications, activities }: any) {
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []); 

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedItem]);

  return (
    <>
      <CustomCursor />
      <Modal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Ultra-Clean Fixed 3D Background */}
      <div className="fixed inset-0 z-[-1] bg-[#020617] pointer-events-none">
        {mounted && (
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
            <color attach="background" args={["#020617"]} />
            <fog attach="fog" args={["#020617", 5, 25]} />
            
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#a1a1aa" />
            <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#ffffff" />
            
            {/* Reduced star intensity to help reading */}
            <Stars radius={100} depth={50} count={2000} factor={2} saturation={0} fade speed={0.5} />
            
            <SceneModels />
            <Environment preset="studio" />
          </Canvas>
        )}
      </div>

      {/* Scrolling Content Overlay */}
      <div className="w-full text-white pb-32 overflow-x-hidden selection:bg-white/20 selection:text-white relative z-10">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 relative"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="max-w-5xl mx-auto bg-[#0a0a0a]/80 backdrop-blur-[40px] p-10 md:p-16 rounded-[40px] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            <p className="text-gray-300 text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-6">Software Engineer</p>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tight drop-shadow-md">
              SHARATH S T
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed px-4 md:px-0 mx-auto max-w-3xl">
              Specializing in high-performance <span className="font-bold text-white">Go backend systems</span>, custom <span className="font-bold text-white">vector databases</span>, and enterprise-scale <span className="font-bold text-white">microservices</span>.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 flex flex-col items-center text-gray-400"
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4">Scroll</p>
            <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent" />
          </motion.div>
        </motion.section>

        {/* Experience Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: "easeOut" }}
          className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 mt-20"
        >
          <div className="w-full max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-12 border-b-2 border-white/20 pb-6">
              Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {experience?.map((exp: any, i: number) => (
                <GlassCard key={i} item={exp} onClick={() => setSelectedItem(exp)} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: "easeOut" }}
          className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 mt-20"
        >
          <div className="w-full max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-12 border-b-2 border-white/20 pb-6">
              Architecture
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects?.map((proj: any, i: number) => (
                <GlassCard key={i} item={proj} onClick={() => setSelectedItem(proj)} />
              ))}
            </div>
          </div>
        </motion.section>
        
        {/* Education & Certs */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: "easeOut" }}
          className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 mt-20"
        >
          <div className="w-full max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-12 border-b-2 border-white/20 pb-6">
              Knowledge Base
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-8 uppercase tracking-[0.2em]">Academic</h3>
                <div className="space-y-6">
                  {education?.map((edu: any, i: number) => (
                    <GlassCard key={i} item={edu} onClick={() => setSelectedItem(edu)} />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-8 uppercase tracking-[0.2em]">Certifications</h3>
                <div className="space-y-6">
                  {certifications?.map((cert: any, i: number) => (
                    <GlassCard key={i} item={cert} onClick={() => setSelectedItem(cert)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Extracurriculars & Publications */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: "easeOut" }}
          className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 mt-20"
        >
          <div className="w-full max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-12 border-b-2 border-white/20 pb-6">
              Beyond Code
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-rose-400 mb-8 uppercase tracking-[0.2em]">Publications</h3>
                <div>
                  {publications?.map((pub: any, i: number) => (
                    <GlassCard key={i} item={pub} onClick={() => setSelectedItem(pub)} isList category="Publications" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-8 uppercase tracking-[0.2em]">Activities</h3>
                <div>
                  {activities?.map((act: any, i: number) => (
                    <GlassCard key={i} item={act} onClick={() => setSelectedItem(act)} isList category="Activities" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </>
  );
}
