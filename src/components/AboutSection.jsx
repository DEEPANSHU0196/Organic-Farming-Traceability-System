import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BadgeCheck, Languages, Link2, Smartphone } from 'lucide-react';
import Reveal, { SectionLabel } from './landing/Reveal';
import farmPhoto from '../assets/background.png';

const PRINCIPLES = [
  { icon: BadgeCheck, title: 'Verified, not claimed', desc: 'Certificates are checked against the farmer’s record before a batch is marked organic.' },
  { icon: Link2, title: 'Tamper-evident', desc: 'Each hand-off is hashed and anchored on Polygon, so edits leave a trail.' },
  { icon: Languages, title: 'In your language', desc: 'The whole platform — and the AgroBot assistant — works in 24 Indian languages.' },
  { icon: Smartphone, title: 'Built for the phone', desc: 'Designed for a basic smartphone in the field, not just a desktop in an office.' },
];

const STATEMENT = 'We started AgroVerse because organic farmers in India do the hard work and lose the premium. Middlemen blur where food comes from, buyers stop trusting the label, and the farmer gets the conventional price. A shared, verifiable record fixes that.';

export default function AboutSection() {
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section id="about" className="border-t border-line px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionLabel index="03">Why we exist</SectionLabel>
            <div ref={imageRef} className="relative mt-8 aspect-[4/5] overflow-hidden rounded-[2rem]">
              <motion.img
                src={farmPhoto}
                alt="Farmland at golden hour"
                style={{ y: imageY, scale: 1.18 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="flex flex-col justify-center">
            {/* Statement reveals word by word as it scrolls in: pacing for the one paragraph that matters. */}
            <p className="font-display text-[clamp(1.6rem,3vw,2.5rem)] font-normal leading-[1.25] tracking-tight text-ink">
              {STATEMENT.split(' ').map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0.15 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
                  transition={{ duration: 0.4, delay: i * 0.025 }}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </p>

            <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {PRINCIPLES.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.07} className="border-t border-line pt-6">
                  <Icon size={22} strokeWidth={1.7} className="text-leaf" />
                  <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
