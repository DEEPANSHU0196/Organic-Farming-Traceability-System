import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, CheckCircle2, Factory, Leaf, PackageCheck, QrCode, ScanLine, ShieldCheck, ShoppingBasket, Truck } from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import backgroundPhoto from '../assets/background.png';
import farmerPhoto from '../assets/farmer.png';
import tractorPhoto from '../assets/tractor.png';

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip);

const stages = [
  { label: 'Farm', detail: 'Harvest recorded', icon: Leaf, image: farmerPhoto },
  { label: 'Quality check', detail: 'Batch verified', icon: ShieldCheck, image: backgroundPhoto },
  { label: 'Packaging', detail: 'Seal registered', icon: PackageCheck, image: tractorPhoto },
  { label: 'In transit', detail: 'Route monitored', icon: Truck, image: backgroundPhoto },
  { label: 'Your table', detail: 'Journey complete', icon: ShoppingBasket, image: farmerPhoto },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1200, easing: 'easeOutQuart' },
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, grid: { color: 'rgba(27,67,50,0.08)' }, ticks: { color: '#6b7c70' } }, x: { grid: { display: false }, ticks: { color: '#6b7c70' } } },
};

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.18 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 650ms ease, transform 650ms ease' }}>{children}</div>;
}

export default function TraceabilityExperience() {
  return (
    <>
      <section id="journey" className="earth-section px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">The AgroVerse promise</p>
            <h2 className="display-heading">Every handoff has a <em>story.</em></h2>
            <p className="mt-5 text-lg leading-relaxed text-[#5d7164]">Follow produce from the soil it came from to the people it feeds. Every stage is timestamped, verified, and visible.</p>
          </Reveal>
          <Reveal className="journey-board">
            <div className="journey-line" />
            <div className="grid gap-8 md:grid-cols-5 md:gap-4">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                return <motion.div key={stage.label} whileHover={{ y: -6 }} className="relative z-10 text-center">
                  <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl border-4 border-[#faf7f0] shadow-lg"><img src={stage.image} alt={stage.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div>
                  <div className="mx-auto -mt-8 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#1b4332] text-[#e9c46a] ring-4 ring-[#faf7f0]"><Icon size={16} /></div>
                  <h3 className="font-bold text-[#1b4332]">{stage.label}</h3><p className="mt-1 text-xs text-[#718278]">{stage.detail}</p>
                  {index < stages.length - 1 && <div className="absolute left-[calc(50%+42px)] top-10 hidden h-px w-[calc(100%-84px)] bg-[#52b788]/50 md:block" />}
                </motion.div>;
              })}
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#1b4332]/10 pt-6 sm:flex-row"><div className="flex items-center gap-3"><div className="rounded-xl bg-[#e9c46a]/25 p-3 text-[#8c622e]"><QrCode size={22} /></div><div><p className="text-sm font-bold text-[#1b4332]">Scan to see the complete journey</p><p className="text-xs text-[#718278]">One product. One transparent record.</p></div></div><button className="flex items-center gap-2 rounded-full bg-[#1b4332] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2d6a4f] hover:shadow-lg"><ScanLine size={16} /> Trace a batch</button></div>
          </Reveal>
        </div>
      </section>

      <section id="impact" className="bg-[#1b4332] px-6 py-24 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow text-[#e9c46a]">Proof in the numbers</p><h2 className="display-heading text-white">A healthier chain, measured.</h2></div><p className="max-w-md text-sm leading-relaxed text-white/65">Live-feeling operational signals help every partner make better decisions, from water use to delivery routes.</p></Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="chart-panel lg:col-span-2"><div className="mb-6 flex items-center justify-between"><div><h3 className="font-bold text-[#1b4332]">Verified supply volume</h3><p className="mt-1 text-xs text-[#718278]">Six-month movement across the network</p></div><BarChart3 className="text-[#52b788]" size={22} /></div><div className="h-64"><Line data={{ labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], datasets: [{ data: [42, 58, 51, 74, 68, 92], borderColor: '#2d6a4f', backgroundColor: 'rgba(82,183,136,0.16)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#e9c46a', pointBorderColor: '#fff', pointBorderWidth: 2 }] }} options={chartOptions} /></div></Reveal>
            <Reveal className="chart-panel"><div className="mb-4"><h3 className="font-bold text-[#1b4332]">Sustainability score</h3><p className="mt-1 text-xs text-[#718278]">Current verified impact mix</p></div><div className="relative mx-auto h-48 w-48"><Doughnut data={{ labels: ['Organic', 'Water saved', 'Low carbon'], datasets: [{ data: [72, 18, 10], backgroundColor: ['#52b788', '#e9c46a', '#a9744f'], borderWidth: 0, hoverOffset: 6 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: '72%', animation: { duration: 1400 } }} /><div className="absolute inset-0 flex flex-col items-center justify-center"><strong className="text-4xl text-[#1b4332]">92%</strong><span className="text-xs text-[#718278]">verified</span></div></div></Reveal>
          </div>
          <Reveal className="mt-5 chart-panel"><div className="mb-6 flex items-center justify-between"><div><h3 className="font-bold text-[#1b4332]">Regional traceability index</h3><p className="mt-1 text-xs text-[#718278]">Verified batches by growing region</p></div><CheckCircle2 className="text-[#52b788]" size={22} /></div><div className="h-52"><Bar data={{ labels: ['Punjab', 'Maharashtra', 'Karnataka', 'Gujarat', 'Kerala'], datasets: [{ data: [88, 76, 82, 69, 94], backgroundColor: ['#2d6a4f', '#52b788', '#e9c46a', '#a9744f', '#1b4332'], borderRadius: 8, borderSkipped: false }] }} options={chartOptions} /></div></Reveal>
        </div>
      </section>

      <section id="trusted" className="bg-[#faf7f0] px-6 py-14 sm:px-8"><Reveal className="mx-auto max-w-7xl"><div className="flex flex-col items-center justify-between gap-6 md:flex-row"><div><p className="eyebrow">Trusted at every stage</p><h2 className="text-2xl font-bold text-[#1b4332]">Built for confidence, not guesswork.</h2></div><div className="flex flex-wrap items-center justify-center gap-3"><span className="trust-badge"><ShieldCheck size={16} /> Organic verified</span><span className="trust-badge"><Factory size={16} /> ISO process</span><span className="trust-badge"><CheckCircle2 size={16} /> Blockchain ready</span></div></div></Reveal></section>
    </>
  );
}
