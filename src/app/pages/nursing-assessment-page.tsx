import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { nursingQuestions, type NursingQuestion } from "@/data/nursing-assessment-questions";
import { SeoManager } from "../seo/seo-manager";
import { useLanguage } from "@/i18n/language-context";

const TOTAL_QUESTIONS = nursingQuestions.length;

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800",
  medium: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  hard: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
};

type AssessmentLocale = 'en' | 'de' | 'ar';

function normaliseLocale(platformLocale: string): AssessmentLocale {
  const l = platformLocale.toLowerCase();
  if (l.startsWith('de')) return 'de';
  if (l.startsWith('ar')) return 'ar';
  return 'en'; // default fallback
}

export function NursingAssessmentPage() {
  const { language, t } = useLanguage();
  const currentLocale = normaliseLocale(language);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = nursingQuestions[current];
  if (!question) {
    return null;
  }

  const questionLocale = question.locales[currentLocale];
  if (!questionLocale || !questionLocale.opts) {
    return null;
  }
  const { q, opts, fb } = questionLocale;
  const isAnswered = answered[current] !== undefined;
  const isLast = current === TOTAL_QUESTIONS - 1;
  const progress = ((current + 1) / TOTAL_QUESTIONS) * 100;

  useEffect(() => {
    document.title = t('nursingAssessment.pageTitle');
  }, [t]);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    setAnswered(prev => ({ ...prev, [current]: optionIndex }));
    if (optionIndex === question.ans) {
      setScore(prev => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!isAnswered) return;
    if (isLast) return; // Stay on results
    setCurrent(prev => prev + 1);
    setShowFeedback(false);
  };

  const handlePrevious = () => {
    if (current === 0) return;
    setCurrent(prev => prev - 1);
    setShowFeedback(false);
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswered({});
    setScore(0);
    setShowFeedback(false);
  };

  const getVerdict = () => {
    const percentage = (score / TOTAL_QUESTIONS) * 100;
    if (percentage >= 80) return { text: t('nursingAssessment.results.verdictExcellent'), color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 60) return { text: t('nursingAssessment.results.verdictGood'), color: "text-amber-600", bg: "bg-amber-50" };
    return { text: t('nursingAssessment.results.verdictNeedsWork'), color: "text-red-600", bg: "bg-red-50" };
  };

  const getDifficultyBreakdown = () => {
    const breakdown = { easy: 0, medium: 0, hard: 0 };
    Object.entries(answered).forEach(([qIndex, selected]) => {
      const q = nursingQuestions[parseInt(qIndex)];
      if (!q) return;
      if (selected === q.ans) {
        breakdown[q.level]++;
      }
    });
    return breakdown;
  };

  if (isLast && isAnswered) {
    // Results screen
    const verdict = getVerdict();
    const breakdown = getDifficultyBreakdown();

    return (
      <main dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language} className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <SeoManager
          title={t('nursingAssessment.pageTitle')}
          description={t('nursingAssessment.description')}
          path="/nursing-assessment"
        />

        <div className="page-container-narrow py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              {t('nursingAssessment.results.title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('nursingAssessment.heading')}
            </p>
          </div>

          {/* Score Circle */}
          <div className="flex justify-center mb-12">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / TOTAL_QUESTIONS) * 94.2} 94.2`}
                  className="text-emerald-500" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-900 dark:text-white">
                    {score}/{TOTAL_QUESTIONS}
                  </div>
                  <div className="text-sm text-slate-400">
                    {Math.round((score / TOTAL_QUESTIONS) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className={`p-6 rounded-2xl ${verdict.bg} border border-slate-200 dark:border-slate-800 mb-8`}>
            <h2 className={`text-2xl font-black ${verdict.color} mb-2`}>
              {verdict.text}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t('nursingAssessment.results.verdictDescription')}
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {Object.entries(breakdown).map(([level, correct]) => (
              <div key={level} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-sm font-bold text-slate-400 uppercase mb-2">
                  {level === 'easy' ? t('nursingAssessment.results.easyLabel') : level === 'medium' ? t('nursingAssessment.results.mediumLabel') : t('nursingAssessment.results.hardLabel')}
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {correct}/{nursingQuestions.filter(q => q.level === level).length}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-accent-primary text-ink rounded-xl font-bold hover:shadow-lg transition-colors"
            >
              {t('nursingAssessment.results.retake')}
            </button>
            <Link
              to="/contact?topic=nursing&action=application&destination=Germany#contact-form"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center"
            >
              {t('nursingAssessment.results.contact')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language} className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <SeoManager
        title={t('nursingAssessment.pageTitle')}
        description={t('nursingAssessment.description')}
        path="/nursing-assessment"
      />


      <div className="page-container-narrow py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
            {t('nursingAssessment.heading')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('nursingAssessment.subheading')}
          </p>
        </div>
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-400">
              {t('nursingAssessment.progress.question')} {current + 1} / {TOTAL_QUESTIONS}
            </span>
            <span className="text-sm font-bold text-slate-400">
              {Math.round(progress)}{t('nursingAssessment.progress.percent')}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8">
          {/* Badges */}
          <div className="flex gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${DIFFICULTY_COLORS[question.level]}`}>
              {t(`nursingAssessment.badges.${question.level}`)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              {t(`nursingAssessment.badges.${question.type}`)}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 leading-relaxed">
            {q}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {opts.map((opt, i) => {
              const isSelected = answered[current] === i;
              const isCorrect = i === question.ans;
              const isWrong = isSelected && !isCorrect;

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-right transition-all ${
                    isAnswered && isCorrect ? 'bg-green-50 border-green-300 text-green-800' :
                    isWrong ? 'bg-red-50 border-red-300 text-red-800' :
                    isAnswered ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400' :
                    'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-lg font-bold text-slate-400 shrink-0">
                      {question.type === 'tf' ? opt : t(`nursingAssessment.options.${String.fromCharCode(97 + i)}`)}
                    </span>
                    <span className="flex-1 text-left">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {question.ans === answered[current] ? t('nursingAssessment.feedback.correct') : t('nursingAssessment.feedback.wrong')}{fb}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={current === 0}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {t('nursingAssessment.nav.previous')}
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-6 py-3 bg-accent-primary text-ink rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-colors"
          >
            {isLast ? t('nursingAssessment.nav.finish') : t('nursingAssessment.nav.next')}
          </button>
        </div>
      </div>
    </main>
  );
}