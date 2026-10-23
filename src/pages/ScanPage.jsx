import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import jsQR from 'jsqr';
import { ArrowLeft, Camera, CameraOff, ImageUp, Keyboard, ScanLine } from 'lucide-react';
import { traceTargetFromQr } from '../utils/traceLink';

export default function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(0);
  const [status, setStatus] = useState('starting'); // starting | scanning | found | denied | unsupported | invalid
  const [manualId, setManualId] = useState('');

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const handleResult = useCallback((text) => {
    const target = traceTargetFromQr(text);
    if (!target) {
      setStatus('invalid');
      return false;
    }
    setStatus('found');
    stop();
    if (navigator.vibrate) navigator.vibrate(60);
    window.setTimeout(() => navigate(target), 650);
    return true;
  }, [navigate, stop]);

  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const w = video.videoWidth;
      const h = video.videoHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, w, h);
      const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
      if (code?.data && handleResult(code.data)) return;
    }
    frameRef.current = requestAnimationFrame(scanFrame);
  }, [handleResult]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported');
      return undefined;
    }
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        return video.play().then(() => {
          setStatus('scanning');
          frameRef.current = requestAnimationFrame(scanFrame);
        });
      })
      .catch(() => setStatus('denied'));
    return () => { cancelled = true; stop(); };
  }, [scanFrame, stop]);

  // Fallback: decode a photo of the QR (works where live camera access is blocked).
  const scanImageFile = (file) => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const code = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
      if (!code?.data || !handleResult(code.data)) setStatus('invalid');
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  const cameraLive = status === 'scanning' || status === 'invalid' || status === 'found';

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <header className="flex items-center gap-3 px-5 pt-5">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-medium">Scan a batch</h1>
          <p className="text-sm text-paper/60">Point your camera at an AgroVerse QR label</p>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-8">
        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] bg-black">
          <video ref={videoRef} muted playsInline className={`h-full w-full object-cover transition-opacity duration-500 ${cameraLive ? 'opacity-100' : 'opacity-0'}`} />
          <canvas ref={canvasRef} className="hidden" />

          {/* Viewfinder */}
          <div className="pointer-events-none absolute inset-8">
            {['left-0 top-0 border-l-4 border-t-4 rounded-tl-2xl', 'right-0 top-0 border-r-4 border-t-4 rounded-tr-2xl', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl', 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl'].map((pos) => (
              <motion.span
                key={pos}
                className={`absolute h-10 w-10 ${pos} ${status === 'found' ? 'border-lime-300' : 'border-paper'}`}
                animate={status === 'found' ? { scale: [1, 0.85, 1] } : {}}
                transition={{ duration: 0.4 }}
              />
            ))}
            {status === 'scanning' && (
              <motion.span
                className="absolute inset-x-2 h-0.5 bg-saffron shadow-[0_0_16px_rgba(217,138,43,0.9)]"
                animate={{ top: ['8%', '92%', '8%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>

          <AnimatePresence>
            {status === 'found' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-leaf/70 backdrop-blur-sm">
                <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="rounded-full bg-paper px-5 py-2.5 font-semibold text-ink">Opening trace…</motion.p>
              </motion.div>
            )}
            {(status === 'starting' || status === 'denied' || status === 'unsupported') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                {status === 'starting' ? <Camera size={34} className="animate-pulse text-paper/70" /> : <CameraOff size={34} className="text-paper/70" />}
                <p className="text-sm text-paper/75">
                  {status === 'starting' && 'Starting camera…'}
                  {status === 'denied' && 'Camera access was blocked. Allow it in your browser settings, or upload a photo of the QR below.'}
                  {status === 'unsupported' && 'This browser can’t open the camera here. Upload a photo of the QR instead.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {status === 'invalid' && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-full bg-amber-400/15 px-4 py-2 text-sm text-amber-200">
              That QR isn’t an AgroVerse batch label. Try another.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-8 w-full max-w-sm space-y-3">
          <label className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 text-sm font-semibold hover:bg-white/5">
            <ImageUp size={18} /> Upload a photo of the QR
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => scanImageFile(e.target.files?.[0])} />
          </label>
          <form
            onSubmit={(e) => { e.preventDefault(); const t = traceTargetFromQr(manualId); if (t) navigate(t); }}
            className="flex items-center gap-2 rounded-2xl border border-white/15 p-1.5 pl-4"
          >
            <Keyboard size={18} className="shrink-0 text-paper/60" />
            <input value={manualId} onChange={(e) => setManualId(e.target.value)} placeholder="Or type the batch ID" aria-label="Batch ID" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-paper/40" />
            <button type="submit" className="flex items-center gap-1.5 rounded-xl bg-paper px-4 py-2.5 text-sm font-semibold text-ink"><ScanLine size={16} /> Trace</button>
          </form>
        </div>
      </div>
    </div>
  );
}
