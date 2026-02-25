import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Target, Brain, Sparkles } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate floating particles with deterministic positions (no randomness)
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (i * 13) % 100,
      y: (i * 7) % 100,
      size: 2 + ((i % 5) * 0.5),
      opacity: 0.3 + ((i % 4) * 0.1),
      speed: 2 + (i % 3),
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    { icon: Brain, text: 'AI-Powered Analysis', delay: 0.2 },
    { icon: Target, text: 'Bias Detection', delay: 0.4 },
    { icon: Shield, text: 'Fact Verification', delay: 0.6 },
    { icon: Zap, text: 'Real-time Results', delay: 0.8 },
  ];

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity],
            }}
            transition={{
              duration: particle.speed + 2,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: (particle.id % 10) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <Shield className="h-16 w-16 text-primary" />
              <motion.div
                className="absolute -inset-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="h-6 w-6 text-blue-500 absolute -top-2 -right-2" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            TruthLens
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Advanced AI-powered system for detecting fake news, bias, and misinformation in real-time
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="p-3 bg-primary/10 rounded-xl mb-3"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-center">{feature.text}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          className="flex justify-center gap-8 mt-16 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { value: '99.2%', label: 'Accuracy Rate' },
            { value: '50K+', label: 'Articles Analyzed' },
            { value: '<2s', label: 'Analysis Time' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="px-6 py-4 rounded-2xl bg-gradient-to-br from-primary/5 to-blue-500/5 backdrop-blur-sm border border-border/30"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-2xl font-bold text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}