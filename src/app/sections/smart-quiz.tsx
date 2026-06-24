import { useEffect, useMemo, useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle, Loader2, ShieldCheck, Sparkles, ChevronLeft, Zap, Award } from 'lucide-react';
import { useLanguage } from '@/i18n/language-context';
import { SEO_EVENTS, trackEvent } from '@/lib/analytics';
import { secureSubmitLead } from '@/lib/secure-submit';
import { TurnstileWidget } from '../components/ui/turnstile-widget';
import { getPublicEnv } from '@/lib/env';
import {
  QUIZ_BASE_SCORE, QUIZ_SCORE_MIN, QUIZ_SCORE_MAX,
  QUIZ_WEIGHTS, QUIZ_FALLBACK_WEIGHTS,
  RECOGNITION_SCORE_MAX,
  VISA_TIMELINE_MAP, VISA_TIMELINE_DEFAULT,
} from '@/data/quiz-config';

interface FormData {
  destination: string;
  studyLevel: string;
  field: string;
  budget: string;
  timeline: string;
}

export function SmartQuiz() {
  const { t, dir, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    destination: 'Germany',
    studyLevel: '',
    field: '',
    budget: '',
    timeline: ''
  });
  const [matchScore, setMatchScore] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isInterimCalculating, setIsInterimCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const { turnstileSiteKey } = getPublicEnv();

  useEffect(() => {
    SEO_EVENTS.ENROLLMENT_STARTED();
  }, []);

  useEffect(() => {
    if (showResult) {
      SEO_EVENTS.ENROLLMENT_COMPLETED();
    }
  }, [showResult]);

  const totalSteps = 5;
  const isNursing = formData.field === 'Nursing';

  // --- Logic Enhancements ---
  const computeMatchScore = (data: FormData) => {
    let score = QUIZ_BASE_SCORE;
    
    score += QUIZ_WEIGHTS[data.destination] ?? QUIZ_FALLBACK_WEIGHTS.destination ?? 4;
    score += QUIZ_WEIGHTS[data.studyLevel] ?? QUIZ_FALLBACK_WEIGHTS.studyLevel ?? 3;
    score += QUIZ_WEIGHTS[data.field] ?? QUIZ_FALLBACK_WEIGHTS.field ?? 3;
    score += QUIZ_WEIGHTS[data.budget] ?? QUIZ_FALLBACK_WEIGHTS.budget ?? 2;
    score += QUIZ_WEIGHTS[data.timeline] ?? QUIZ_FALLBACK_WEIGHTS.timeline ?? 2;

    return Math.min(QUIZ_SCORE_MAX, Math.max(QUIZ_SCORE_MIN, score));
  };

  const recognitionScore = useMemo(() => {
    let score = QUIZ_BASE_SCORE;
    if (formData.timeline === 'Next semester') score += 6;
    if (formData.budget === 'Above 60000') score += 4;
    if (formData.destination === 'Germany') score += 6;
    return Math.min(RECOGNITION_SCORE_MAX, score);
  }, [formData]);

  const languageRequirement = useMemo(() => {
    if (!isNursing) return 'B2';
    return formData.destination === 'Germany' ? 'B2' : 'B2-C1';
  }, [formData.destination, isNursing]);

  const recognitionTimeline = useMemo(() => {
    if (!isNursing) return '6-10 months';
    if (formData.timeline === 'Next semester') return '8-12 months';
    if (formData.timeline === 'Within 6 months') return '10-14 months';
    return '12-18 months';
  }, [formData.timeline, isNursing]);

  const visaEstimator = useMemo(() => {
    return VISA_TIMELINE_MAP[formData.timeline] || VISA_TIMELINE_DEFAULT;
  }, [formData.timeline]);

  // --- Handlers ---
  const handleNext = () => {
    setValidationError('');
    if (step < totalSteps) {
      if (step === 3) {
        setIsInterimCalculating(true);
        setTimeout(() => {
          setIsInterimCalculating(false);
          setStep(step + 1);
        }, 900);
        return;
      }
      setStep(step + 1);
    } else {
      setIsCalculating(true);
      const target = computeMatchScore(formData);
      if (shouldReduceMotion) {
        setIsCalculating(false);
        setMatchScore(target);
        setShowResult(true);
      } else {
        setTimeout(() => {
          setIsCalculating(false);
          let current = 0;
          const interval = setInterval(() => {
            current += 2;
            if (current >= target) {
              setMatchScore(target);
              clearInterval(interval);
              setTimeout(() => setShowResult(true), 300);
            } else {
              setMatchScore(current);
            }
          }, 25);
        }, 1500);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setValidationError('');
      setStep(step - 1);
    }
  };

  const handleConsultation = async () => {
    if (turnstileSiteKey && !turnstileToken) {
      setValidationError(t<string>('quiz.validationRequired'));
      return;
    }

    setSubmitStatus('submitting');
    const success = await secureSubmitLead({ ...formData, matchScore, language, turnstileToken });
    setSubmitStatus(success ? 'success' : 'error');
    if (success) {
      setTurnstileToken('');
      setTurnstileResetKey((prev) => prev + 1);
    }
    
    const contact = document.getElementById('contact');
    contact?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Sub-Components for Render ---
  const OptionButton = ({ label, value, field }: { label: string, value: string, field: keyof FormData }) => (
    <button
      type="button"
      role="radio"
      aria-checked={formData[field] === value}
      onClick={() => {
        setFormData({ ...formData, [field]: value });
        setTimeout(handleNext, 300);
      }}
      className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 group relative overflow-hidden ${
        formData[field] === value
          ? 'border-accent-tech bg-accent-tech/5 ring-1 ring-accent-tech'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex justify-between items-center relative z-10">
        <span className={`font-bold ${formData[field] === value ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
          {label}
        </span>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          formData[field] === value ? 'border-accent-tech bg-accent-tech' : 'border-slate-200 dark:border-slate-700'
        }`}>
          {formData[field] === value && <CheckCircle className="w-3 h-3 text-white" />}
        </div>
      </div>
    </button>
  );

  return (
    <section className="relative py-16 sm:py-24 px-[var(--content-gutter)] overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-150 h-150 bg-accent-tech/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-accent-success/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4 text-accent-tech" /> {t<string>('quiz.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            {t<string>('quiz.title')}
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t<string>('quiz.description')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[550px] flex flex-col">
          
          <AnimatePresence mode="wait">
            {!isCalculating && !showResult && !isInterimCalculating ? (
              <m.div 
                key="quiz-body"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8 md:p-12 flex flex-col h-full"
              >
                {/* Header / Progress */}
                <div className="flex items-center justify-between mb-12">
                  <button 
                    onClick={handleBack} disabled={step === 1}
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-0 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> {t<string>('quiz.back')}
                  </button>
                  <div className="flex flex-col items-end gap-1">
                    <span aria-live="polite" className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t<string>('quiz.stepLabel')} {step} {t<string>('quiz.of')} {totalSteps}</span>
                    <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <m.div 
                        className="h-full bg-accent-tech"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Question Area */}
                <div className="flex-grow">
                  <h3 id="quiz-question" className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                    {step === 1 && t<string>('quiz.questions.destination')}
                    {step === 2 && t<string>('quiz.questions.studyLevel')}
                    {step === 3 && t<string>('quiz.questions.field')}
                    {step === 4 && t<string>('quiz.questions.budget')}
                    {step === 5 && t<string>('quiz.questions.timeline')}
                  </h3>

                  <div role="radiogroup" aria-labelledby="quiz-question" className="grid md:grid-cols-2 gap-4">
                    {step === 1 && (t<{ value: string; label: string }[]>('quiz.destinations') || []).map(o => <OptionButton key={o.value} label={o.label} value={o.value} field="destination" />)}
                    {step === 2 && (t<{ value: string; label: string }[]>('quiz.studyLevels') || []).map(o => <OptionButton key={o.value} label={o.label} value={o.value} field="studyLevel" />)}
                    {step === 3 && (t<{ value: string; label: string }[]>('quiz.fields') || []).map(o => <OptionButton key={o.value} label={o.label} value={o.value} field="field" />)}
                    {step === 4 && (t<{ value: string; label: string }[]>('quiz.budgets') || []).map(o => <OptionButton key={o.value} label={o.label} value={o.value} field="budget" />)}
                    {step === 5 && (t<{ value: string; label: string }[]>('quiz.timelines') || []).map(o => <OptionButton key={o.value} label={o.label} value={o.value} field="timeline" />)}
                  </div>
                </div>

                {/* Nursing Contextual Info */}
                {step === 3 && isNursing && (
                  <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 flex gap-4">
                    <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900 dark:text-emerald-400">{t<string>('quiz.nursingSpecializedTitle')}</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-500">{t<string>('quiz.nursingSpecializedDescription')}</p>
                    </div>
                  </m.div>
                )}
                
                <div className="mt-12 flex justify-center text-slate-400 text-xs gap-4 font-medium uppercase tracking-widest">
                   <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {t<string>('quiz.dataSecure')}</div>
                </div>
              </m.div>
            ) : (isCalculating || isInterimCalculating) ? (
              <m.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[550px] p-12 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-accent-tech/20 blur-3xl rounded-full animate-pulse" />
                  <Loader2 className="w-16 h-16 text-accent-tech animate-spin relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {isInterimCalculating ? t<string>('quiz.probabilityDelay') : t<string>('quiz.calculatingTitle')}
                </h3>
                <p className="text-slate-500">{t<string>('quiz.calculatingSubtitle')}</p>
              </m.div>
            ) : (
              // --- RESULTS VIEW ---
              <m.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-12">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left: Gauge */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="relative w-64 h-64">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="128" cy="128" r="110" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" />
                        <m.circle 
                          cx="128" cy="128" r="110" fill="none" stroke="url(#resultGrad)" 
                          strokeWidth="12" strokeDasharray="691"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: 691 }}
                          animate={{ strokeDashoffset: 691 - (matchScore / 100) * 691 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="resultGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgb(var(--accent-tech))" />
                            <stop offset="100%" stopColor="rgb(var(--success))" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{matchScore}%</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t<string>('quiz.resultLabel')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-md mb-6">
                      <Zap className="w-3 h-3" /> {t<string>('quiz.resultBadge')}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t<string>('quiz.resultTitle')}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                      {t<string>('quiz.resultDescription')}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                       <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t<string>('quiz.visaProcessing')}</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{visaEstimator}</p>
                       </div>
                       {isNursing && (
                         <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t<string>('quiz.recognition')}</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{recognitionScore}%</p>
                         </div>
                       )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {turnstileSiteKey && (
                        <div className="w-full">
                          <TurnstileWidget
                            siteKey={turnstileSiteKey}
                            onTokenChange={setTurnstileToken}
                            resetKey={String(turnstileResetKey)}
                          />
                        </div>
                      )}

                      <button 
                        onClick={handleConsultation}
                        disabled={submitStatus === 'submitting' || (!!turnstileSiteKey && !turnstileToken)}
                        className="flex-1 px-8 py-4 btn-gold-primary rounded-xl font-bold text-sm shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitStatus === 'submitting' ? t<string>('quiz.submitting') : t<string>('quiz.consultationCta')}
                      </button>
                      <button 
                        onClick={() => { setStep(1); setShowResult(false); }}
                        className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm"
                      >
                        {t<string>('quiz.restart')}
                      </button>
                    </div>

                    {submitStatus === 'error' && (
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center" role="alert">
                        {t<string>('quiz.submitError')}
                      </p>
                    )}
                  </div>

                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}