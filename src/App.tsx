import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  Crosshair, 
  Eye, 
  BrainCircuit, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  ChevronDown,
  Terminal,
  Lock,
  Activity,
  Target,
  Layers,
  Search,
  ArrowRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

function WaitlistForm({ className = "", inputClassName = "" }: { className?: string, inputClassName?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully joined the waitlist!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to join waitlist.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}>
        <div className="relative w-full sm:w-auto">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            placeholder="Enter your email..." 
            className={`w-full sm:w-80 h-14 px-6 rounded-full focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 text-white placeholder:text-zinc-500 transition-all ${inputClassName}`}
            required
          />
        </div>
        <button 
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full sm:w-auto h-14 px-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
        >
          {status === "loading" ? "Joining..." : status === "success" ? "Joined!" : "Join Waitlist"} 
          {status !== "success" && status !== "loading" && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      {message && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative perspective-1000 ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex overflow-hidden w-full group py-10">
      <motion.div
        className="flex whitespace-nowrap gap-6 px-3"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-mirror border-b-0 border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.5)]">
            <Crosshair className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">Autopsy<span className="text-orange-500">Engine</span></span>
        </div>
        <button className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center pt-28 md:pt-36 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#050505]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-[40%_60%_70%_30%] bg-orange-900/20 blur-[120px] pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-[60%_40%_30%_70%] bg-orange-600/10 blur-[120px] pointer-events-none"
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex-grow flex flex-col justify-center pb-32">
        <motion.div
          style={{ opacity, y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]) }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            SYSTEM ONLINE // EARLY ACCESS LIMITED
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Decode Any Competitor. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 text-glow">
              Steal Their Strategy.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Turn any website into a deep competitor intelligence report in seconds. Reveal their business model, expose weaknesses, and generate an actionable attack plan to outperform them.
          </p>
          
          <WaitlistForm inputClassName="glass-mirror" />
          
          <p className="mt-4 text-xs text-zinc-500 font-mono">Join 4,209+ top marketers already on the list.</p>
        </motion.div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="py-32 relative z-10 border-t border-white/5 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              You are losing time <span className="text-zinc-500">guessing.</span>
            </h2>
            <p className="text-lg text-zinc-400">
              The internet is a battlefield. But while you're looking at traffic charts and keyword volumes, your competitors are quietly executing high-converting strategies you can't see.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Search className="w-6 h-6 text-orange-400" />,
              title: "Blind Analysis",
              desc: "You waste hours manually clicking through funnels, trying to reverse-engineer what makes them work."
            },
            {
              icon: <Layers className="w-6 h-6 text-orange-400" />,
              title: "Data, Not Strategy",
              desc: "Standard SEO tools give you raw numbers. They don't tell you the psychological triggers driving their sales."
            },
            {
              icon: <Activity className="w-6 h-6 text-orange-400" />,
              title: "Bleeding Revenue",
              desc: "Every day you operate without clarity is a day your competitors steal market share with superior positioning."
            }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <TiltCard>
                <div className="glass-mirror p-8 rounded-2xl h-full hover:border-orange-500/30 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-mono">
                <Terminal className="w-3 h-3" />
                THE TRANSFORMATION
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                The decision-making <br/>
                <span className="text-orange-500">intelligence layer</span> <br/>
                for the web.
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Competitor Autopsy Engine isn't an analytics tool. It's an AI-powered strategic extraction system. It reads between the lines of any website to reveal the hidden mechanics of their business.
              </p>
              <ul className="space-y-4">
                {[
                  "Instantly decodes any website structure",
                  "Reveals hidden business models & pricing logic",
                  "Detects conversion weaknesses & gaps",
                  "Generates a step-by-step attack strategy"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="absolute inset-0 bg-orange-600/20 blur-[100px] rounded-full"></div>
              <div className="glass-mirror-orange rounded-2xl p-1 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" 
                  alt="Dashboard Data" 
                  className="rounded-xl opacity-50 mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>
                
                {/* Overlay UI elements */}
                <div className="absolute bottom-6 left-6 right-6 glass-mirror rounded-xl p-4 border-orange-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-orange-400">ANALYSIS_COMPLETE</span>
                    <span className="text-xs font-mono text-zinc-500">100%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const features = [
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Business Model Detection Engine",
      desc: "Understand exactly how they make money, structure their offers, and monetize traffic."
    },
    {
      icon: <BrainCircuit className="w-5 h-5" />,
      title: "Strategy Reconstruction System",
      desc: "Reverse-engineer their marketing playbook and positioning strategy instantly."
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Conversion Psychology Analysis",
      desc: "Decode the psychological triggers, urgency tactics, and copy structures they use to convert."
    },
    {
      icon: <ShieldAlert className="w-5 h-5" />,
      title: "Competitor Weakness Scanner",
      desc: "Identify critical gaps in their messaging, UX, and product offerings that you can exploit."
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Attack Strategy Generator",
      desc: "Get step-by-step tactical plans to out-position, out-market, and out-sell them."
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Funnel Reconstruction Logic",
      desc: "Map out their entire customer journey from entry point to checkout and upsell."
    }
  ];

  return (
    <section className="py-32 relative z-10 bg-zinc-950 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              Weapons-grade <span className="text-orange-500">capabilities.</span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Everything you need to dissect a competitor's business and build a superior strategy.
            </p>
          </div>
        </FadeIn>
      </div>

      <Marquee>
        {features.map((feature, i) => (
          <div key={i} className="w-[350px] flex-shrink-0">
            <TiltCard>
              <div className="glass-mirror p-6 rounded-2xl hover:bg-white/[0.05] transition-all group hover:border-orange-500/30 h-[220px]">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 text-zinc-400 group-hover:text-orange-400 group-hover:border-orange-500/30 transition-colors shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 whitespace-normal">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-normal">{feature.desc}</p>
              </div>
            </TiltCard>
          </div>
        ))}
      </Marquee>
    </section>
  );
}

function WowMoment() {
  return (
    <section className="py-40 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-orange-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.15)_0%,transparent_70%)]"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            The moment the web becomes <span className="text-orange-500 text-glow">transparent.</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light">
            Suddenly, a normal website becomes a strategic map. You understand exactly why they win. And more importantly—<span className="font-semibold text-white">you realize exactly how you can beat them.</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="py-32 relative z-10 bg-zinc-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Save Hours", desc: "Eliminate manual research and spreadsheet tracking." },
                { title: "Faster Decisions", desc: "Act on intelligence, not assumptions or gut feelings." },
                { title: "Spot Weaknesses", desc: "Instantly see where they drop the ball on conversion." },
                { title: "Unfair Advantage", desc: "Operate with insights your competitors don't have." }
              ].map((item, i) => (
                <TiltCard key={i}>
                  <div className="glass-mirror p-6 rounded-2xl h-full">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400">{item.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              Stop competing on effort. <br/>
              Start competing on <span className="text-orange-500">insight.</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-8">
              In modern SaaS and e-commerce, the winner isn't the one who works the hardest. It's the one who understands the market mechanics the best.
            </p>
            <button className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
              Get the Advantage
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-xs font-mono mb-8">
            THE DIFFERENCE
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16">
            The first browser-native <br/>
            competitor intelligence system.
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="text-left">
              <div className="text-orange-500 font-mono text-sm mb-2">01 / DATA VS INSIGHT</div>
              <h3 className="text-2xl font-bold text-white mb-3">Not just data — interpretation.</h3>
              <p className="text-zinc-400">Anyone can scrape a site. We interpret the structure to tell you *why* they built it that way.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="text-left">
              <div className="text-orange-500 font-mono text-sm mb-2">02 / ANALYTICS VS STRATEGY</div>
              <h3 className="text-2xl font-bold text-white mb-3">Not analytics — strategy.</h3>
              <p className="text-zinc-400">Traffic numbers don't pay the bills. Understanding their conversion psychology does.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="text-left">
              <div className="text-orange-500 font-mono text-sm mb-2">03 / REPORTS VS ACTION</div>
              <h3 className="text-2xl font-bold text-white mb-3">Not reports — attack plans.</h3>
              <p className="text-zinc-400">We don't leave you with a PDF. We give you a tactical checklist to exploit their weaknesses.</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-32 relative z-10 bg-zinc-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Intelligence at <span className="text-orange-500">scale.</span>
            </h2>
            <p className="text-lg text-zinc-400">Accessible pricing. Premium insights.</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <FadeIn delay={0.1}>
            <TiltCard className="h-full">
              <div className="glass-mirror p-8 rounded-3xl flex flex-col h-full">
                <h3 className="text-xl font-bold text-white mb-2">Recon</h3>
                <div className="text-3xl font-display font-bold text-white mb-6">$0<span className="text-lg text-zinc-500 font-sans font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-zinc-400"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Limited analyses per month</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-400"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Basic business model insights</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-400"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Standard support</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors font-medium">
                  Join Waitlist
                </button>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Pro Tier */}
          <FadeIn delay={0.2}>
            <TiltCard className="h-full relative transform md:-translate-y-4">
              <div className="glass-mirror-orange p-8 rounded-3xl flex flex-col h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full shadow-[0_0_15px_rgba(234,88,12,0.5)]">
                  MOST POPULAR
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Operative</h3>
                <div className="text-3xl font-display font-bold text-white mb-6">$15<span className="text-lg text-zinc-500 font-sans font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Unlimited website analysis</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Full competitor breakdown</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Attack strategy generator</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Priority processing</li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors font-medium shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                  Join Waitlist
                </button>
              </div>
            </TiltCard>
          </FadeIn>

          {/* Agency Tier */}
          <FadeIn delay={0.3}>
            <TiltCard className="h-full">
              <div className="glass-mirror p-8 rounded-3xl flex flex-col h-full relative">
                <div className="absolute top-4 right-4 px-2 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded border border-white/10 uppercase tracking-wider">
                  Coming Soon
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Syndicate</h3>
                <div className="text-3xl font-display font-bold text-white mb-6">$49<span className="text-lg text-zinc-500 font-sans font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-grow opacity-60">
                  <li className="flex items-center gap-3 text-sm text-zinc-400"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Everything in Operative</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-400"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Multi-client workspaces</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-400"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Deep analysis engine</li>
                  <li className="flex items-center gap-3 text-sm text-zinc-400"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> White-label exportable reports</li>
                </ul>
                <button disabled className="w-full py-3 rounded-xl border border-white/5 text-zinc-500 bg-white/5 cursor-not-allowed font-medium">
                  Waitlist Full
                </button>
              </div>
            </TiltCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What is Competitor Autopsy Engine?",
      a: "A Chrome extension that uses advanced AI to analyze any website and generate a comprehensive competitive strategy report instantly."
    },
    {
      q: "How does it work?",
      a: "Just click the extension on any website. Our AI scans the copy, structure, metadata, and user flow to reconstruct their business model and strategy."
    },
    {
      q: "Who is it for?",
      a: "Founders, growth marketers, and agencies who want an unfair advantage in their market by understanding exactly what their competitors are doing."
    },
    {
      q: "Is this replacing SEO tools?",
      a: "No. SEO tools give you traffic data and keywords. We give you business strategy, conversion psychology, and actionable attack plans."
    },
    {
      q: "Is my data safe?",
      a: "Yes. We don't track your browsing history. The engine only runs on the specific sites you actively choose to analyze."
    },
    {
      q: "When will it launch?",
      a: "We are rolling out invites to our waitlist soon. Secure your spot now to guarantee early access and locked-in pricing."
    }
  ];

  return (
    <section className="py-32 relative z-10">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>
        </FadeIn>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <details className="group glass-mirror rounded-xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer text-white font-medium">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section className="py-32 relative z-10 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-orange-900/10"></div>
      <motion.div 
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-600/20 blur-[120px] pointer-events-none"
      ></motion.div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock className="w-12 h-12 text-orange-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Get Early Access <br/> Before Public Launch
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Join the waitlist today to secure priority access, early features, and a lower pricing tier. Slots are strictly limited.
          </p>
          
          <WaitlistForm className="max-w-xl mx-auto" inputClassName="bg-zinc-900/80 border border-white/10" />
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-white/5 bg-black relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-orange-500" />
          <span className="font-display font-bold text-sm text-white">Autopsy<span className="text-orange-500">Engine</span></span>
        </div>
        <div className="text-xs text-zinc-600 font-mono">
          &copy; {new Date().getFullYear()} Competitor Autopsy Engine. All rights reserved.
        </div>
        <div className="flex gap-4 text-sm text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-black selection:bg-orange-500/30 selection:text-orange-200">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Capabilities />
        <WowMoment />
        <Benefits />
        <WhyUs />
        <Pricing />
        <Waitlist />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

