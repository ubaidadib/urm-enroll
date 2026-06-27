import { useLanguage } from "@/i18n/language-context";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { SmartQuiz } from "../sections/smart-quiz";
import { SeoManager } from "../seo/seo-manager";

export function QuizPage() {
  const { t } = useLanguage();

  return (
    <main className="bg-bg-primary text-text-primary transition-colors duration-500">
      <SeoManager
        title={t<string>("seo.sections.quiz.title")}
        description={t<string>("seo.sections.quiz.description")}
        path="/quiz"
        breadcrumbs={[
          { name: t<string>("seo.siteName"), path: "/" },
          { name: t<string>("seo.sections.quiz.title"), path: "/quiz" },
        ]}
      />
      <div className="page-container pt-10">
        <h1 className="sr-only">{t<string>("seo.sections.quiz.title")}</h1>
        <Breadcrumbs
          className="mb-5 lg:mb-4"
          items={[
            { label: t<string>("common.home"), href: "/" },
            { label: t<string>("quiz.title"), href: "/quiz" },
          ]}
        />
      </div>
      <SmartQuiz />
    </main>
  );
}
