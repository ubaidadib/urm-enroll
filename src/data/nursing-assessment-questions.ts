export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mc' | 'tf' | 'scenario';
export type Locale = 'en' | 'de' | 'ar';

export interface NursingQuestionLocale {
  q: string;
  opts: string[];
  fb: string;
}

export interface NursingQuestion {
  id: number;
  level: Difficulty;
  type: QuestionType;
  ans: number;
  locales: Record<Locale, NursingQuestionLocale>;
}

export const nursingQuestions: NursingQuestion[] = [
  {
    id: 1,
    level: "easy",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "What is the official language required to work as a nurse in Germany?",
        opts: ["English", "German", "French", "Arabic"],
        fb: "German is the mandatory requirement. A minimum B2 level in German is required to obtain the professional licence."
      },
      de: {
        q: "Welche Amtssprache ist für die Arbeit als Pflegekraft in Deutschland erforderlich?",
        opts: ["Englisch", "Deutsch", "Französisch", "Arabisch"],
        fb: "Deutsch ist die Pflichtvoraussetzung. Für die Berufserlaubnis ist mindestens das Sprachniveau B2 in Deutsch erforderlich."
      },
      ar: {
        q: "ما هي اللغة الرسمية المطلوبة للعمل كممرض في ألمانيا؟",
        opts: ["الإنجليزية", "الألمانية", "الفرنسية", "العربية"],
        fb: "اللغة الألمانية هي المتطلب الأساسي. يُشترط الحصول على مستوى B2 على الأقل في اللغة الألمانية للحصول على الترخيص المهني."
      }
    }
  },
  {
    id: 2,
    level: "easy",
    type: "tf",
    ans: 1,
    locales: {
      en: {
        q: "True or False: A foreign nurse can work in Germany immediately without having their qualification recognised.",
        opts: ["True", "False"],
        fb: "False. Official recognition of the qualification from the relevant German authority is required before practising."
      },
      de: {
        q: "Richtig oder Falsch: Eine ausländische Pflegekraft kann ohne Anerkennung ihrer Qualifikation sofort in Deutschland arbeiten.",
        opts: ["Richtig", "Falsch"],
        fb: "Falsch. Vor der Berufsausübung ist eine offizielle Anerkennung der Qualifikation durch die zuständige deutsche Behörde erforderlich."
      },
      ar: {
        q: "صواب أم خطأ: يمكن للممرض الأجنبي العمل في ألمانيا مباشرةً دون الحاجة إلى الاعتراف بشهادته.",
        opts: ["صواب", "خطأ"],
        fb: "خطأ. يجب الحصول على اعتراف رسمي بالشهادة من السلطات الألمانية المختصة قبل ممارسة المهنة."
      }
    }
  },
  {
    id: 3,
    level: "easy",
    type: "mc",
    ans: 0,
    locales: {
      en: {
        q: "What is the minimum years of experience typically required to apply for the nursing programme in Germany?",
        opts: ["No minimum", "One year", "Two years", "Five years"],
        fb: "There is no mandatory minimum experience in most programme pathways, although clinical experience strengthens the application."
      },
      de: {
        q: "Wie viele Jahre Berufserfahrung sind typischerweise für das Pflegeprogramm in Deutschland mindestens erforderlich?",
        opts: ["Kein Minimum", "Ein Jahr", "Zwei Jahre", "Fünf Jahre"],
        fb: "In den meisten Programmwegen gibt es kein verbindliches Mindestmaß an Erfahrung, obwohl klinische Erfahrung die Bewerbung stärkt."
      },
      ar: {
        q: "ما الحد الأدنى لسنوات الخبرة المطلوبة عادةً للتقديم على برنامج التمريض في ألمانيا؟",
        opts: ["لا يوجد حد أدنى", "سنة واحدة", "سنتان", "خمس سنوات"],
        fb: "لا يوجد حد أدنى إلزامي للخبرة في معظم مسارات البرنامج، غير أن الخبرة السريرية تُعزز فرص القبول."
      }
    }
  },
  {
    id: 4,
    level: "easy",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "Which of the following documents is essential when applying for the nursing programme in Germany?",
        opts: ["Secondary school certificate only", "Nursing diploma + certified translation", "Passport only", "Recommendation letter from a doctor"],
        fb: "The nursing diploma with its official certified German translation is essential. Other documents such as the experience certificate and birth certificate are also required."
      },
      de: {
        q: "Welches der folgenden Dokumente ist bei der Bewerbung für das Pflegeprogramm in Deutschland unerlässlich?",
        opts: ["Nur Schulabschlusszeugnis", "Pflegediplom + beglaubigte Übersetzung", "Nur Reisepass", "Empfehlungsschreiben eines Arztes"],
        fb: "Das Pflegediplom mit beglaubigter Übersetzung ins Deutsche ist unerlässlich. Weitere Dokumente wie die Berufserfahrungsbescheinigung und Geburtsurkunde sind ebenfalls erforderlich."
      },
      ar: {
        q: "أي من المستندات التالية ضروري للتقديم على برنامج التمريض في ألمانيا؟",
        opts: ["شهادة الثانوية العامة فقط", "شهادة التمريض + ترجمة معتمدة", "جواز السفر فقط", "رسالة توصية من طبيب"],
        fb: "شهادة التمريض مع ترجمتها الرسمية إلى الألمانية أمر أساسي. كما تُطلب مستندات أخرى مثل شهادة الخبرة وشهادة الميلاد."
      }
    }
  },
  {
    id: 5,
    level: "easy",
    type: "tf",
    ans: 0,
    locales: {
      en: {
        q: "True or False: Foreign nurses in Germany receive the same salary as German nurses.",
        opts: ["True", "False"],
        fb: "True. German labour law protects the principle of equal pay and applies to all workers regardless of nationality."
      },
      de: {
        q: "Richtig oder Falsch: Ausländische Pflegekräfte in Deutschland erhalten dasselbe Gehalt wie deutsche Pflegekräfte.",
        opts: ["Richtig", "Falsch"],
        fb: "Richtig. Das deutsche Arbeitsrecht schützt den Grundsatz der Lohngleichheit und gilt für alle Arbeitnehmer unabhängig von ihrer Nationalität."
      },
      ar: {
        q: "صواب أم خطأ: يحصل الممرضون الأجانب في ألمانيا على نفس الراتب المقرر للممرضين الألمان.",
        opts: ["صواب", "خطأ"],
        fb: "صواب. يحمي القانون الألماني مبدأ المساواة في الأجور، ويُطبَّق على جميع العاملين بصرف النظر عن جنسياتهم."
      }
    }
  },
  {
    id: 6,
    level: "medium",
    type: "mc",
    ans: 2,
    locales: {
      en: {
        q: "What German language level is required to obtain the professional nursing licence in Germany?",
        opts: ["A2", "B1", "B2", "C1"],
        fb: "B2 is the minimum level required to obtain the Berufserlaubnis (professional licence). Some federal states require C1 at a later stage."
      },
      de: {
        q: "Welches Deutschniveau ist für die Berufserlaubnis in der Pflege in Deutschland erforderlich?",
        opts: ["A2", "B1", "B2", "C1"],
        fb: "B2 ist das Mindestniveau für die Berufserlaubnis. Einige Bundesländer verlangen in einer späteren Phase C1."
      },
      ar: {
        q: "ما هو مستوى اللغة الألمانية المطلوب للحصول على ترخيص مزاولة مهنة التمريض في ألمانيا؟",
        opts: ["A2", "B1", "B2", "C1"],
        fb: "المستوى B2 هو الحد الأدنى المطلوب للحصول على الترخيص المهني (Berufserlaubnis). بعض الولايات تشترط C1 في مرحلة لاحقة."
      }
    }
  },
  {
    id: 7,
    level: "medium",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "Which body is responsible for recognising foreign nursing qualifications in Germany?",
        opts: ["The Federal Ministry of Health", "The state authority (Landesbehörde)", "The German Nurses Association", "The World Health Organization"],
        fb: "Each German federal state (Bundesland) handles recognition independently, so procedures may differ from state to state."
      },
      de: {
        q: "Welche Stelle ist für die Anerkennung ausländischer Pflegequalifikationen in Deutschland zuständig?",
        opts: ["Das Bundesgesundheitsministerium", "Die Landesbehörde", "Der Deutsche Pflegeverband", "Die Weltgesundheitsorganisation"],
        fb: "Jedes deutsche Bundesland regelt die Anerkennung eigenständig, daher können die Verfahren von Bundesland zu Bundesland variieren."
      },
      ar: {
        q: "ما هي الجهة المسؤولة عن الاعتراف بشهادات التمريض الأجنبية في ألمانيا؟",
        opts: ["وزارة الصحة الفيدرالية", "سلطات الولاية (Landesbehörde)", "نقابة الممرضين الألمانية", "منظمة الصحة العالمية"],
        fb: "تتولى كل ولاية ألمانية (Bundesland) مسؤولية الاعتراف بالشهادات بشكل مستقل، لذلك قد تختلف الإجراءات من ولاية إلى أخرى."
      }
    }
  },
  {
    id: 8,
    level: "medium",
    type: "mc",
    ans: 2,
    locales: {
      en: {
        q: "What is the approximate average gross monthly salary for a qualified nurse in Germany?",
        opts: ["€500 – €800", "€1,000 – €1,500", "€2,500 – €3,500", "€5,000 or more"],
        fb: "The gross salary typically ranges between €2,500 and €3,500 per month for a qualified nurse, and increases with experience and specialisation."
      },
      de: {
        q: "Wie hoch ist das durchschnittliche monatliche Bruttogehalt einer qualifizierten Pflegekraft in Deutschland?",
        opts: ["500 – 800 €", "1.000 – 1.500 €", "2.500 – 3.500 €", "5.000 € oder mehr"],
        fb: "Das Bruttogehalt liegt in der Regel zwischen 2.500 und 3.500 € monatlich für eine qualifizierte Pflegekraft und steigt mit Erfahrung und Spezialisierung."
      },
      ar: {
        q: "ما هو إجمالي متوسط الراتب الشهري لممرض مؤهل في ألمانيا تقريباً؟",
        opts: ["500 – 800 يورو", "1,000 – 1,500 يورو", "2,500 – 3,500 يورو", "5,000 يورو فأكثر"],
        fb: "يتراوح الراتب الإجمالي عادةً بين 2,500 و3,500 يورو شهرياً للممرض المؤهل، ويرتفع مع الخبرة والتخصص."
      }
    }
  },
  {
    id: 9,
    level: "medium",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "What does the Anerkennungsberatung stage mean in the German nursing pathway?",
        opts: ["Applying for a work visa", "A qualification recognition consultation", "Sitting the German language test", "Registering with the nurses association"],
        fb: "Anerkennungsberatung means 'recognition consultation' — a key stage for evaluating your qualifications and identifying gaps against German standards."
      },
      de: {
        q: "Was bedeutet die Anerkennungsberatung im deutschen Pflegeweg?",
        opts: ["Beantragung eines Arbeitsvisums", "Beratung zur Qualifikationsanerkennung", "Ablegen des Deutschtests", "Anmeldung beim Pflegeverband"],
        fb: "Anerkennungsberatung ist eine Schlüsselphase zur Bewertung Ihrer Qualifikationen und zur Feststellung von Unterschieden gegenüber deutschen Standards."
      },
      ar: {
        q: "ما الذي تعنيه مرحلة 'Anerkennungsberatung' في مسار التمريض الألماني؟",
        opts: ["التقديم على تأشيرة العمل", "استشارة الاعتراف بالمؤهلات", "اجتياز اختبار اللغة الألمانية", "التسجيل في نقابة الممرضين"],
        fb: "Anerkennungsberatung تعني 'استشارة الاعتراف'، وهي مرحلة أساسية لتقييم مؤهلاتك ومعرفة الفروق مع المعايير الألمانية."
      }
    }
  },
  {
    id: 10,
    level: "medium",
    type: "tf",
    ans: 0,
    locales: {
      en: {
        q: "True or False: A nurse can begin working in Germany while awaiting full recognition of their qualification.",
        opts: ["True", "False"],
        fb: "True. A Berufserlaubnis (temporary licence) can be obtained, allowing work during the full recognition process."
      },
      de: {
        q: "Richtig oder Falsch: Eine Pflegekraft kann in Deutschland arbeiten, während sie auf die vollständige Anerkennung ihrer Qualifikation wartet.",
        opts: ["Richtig", "Falsch"],
        fb: "Richtig. Es kann eine Berufserlaubnis (vorläufige Genehmigung) erteilt werden, die während des Anerkennungsverfahrens zur Arbeit berechtigt."
      },
      ar: {
        q: "صواب أم خطأ: يمكن للممرض أن يبدأ العمل في ألمانيا خلال فترة انتظار الاعتراف الكامل بشهادته.",
        opts: ["صواب", "خطأ"],
        fb: "صواب. يمكن الحصول على 'Berufserlaubnis' وهو ترخيص مؤقت يتيح العمل خلال فترة إجراءات الاعتراف الكاملة."
      }
    }
  },
  {
    id: 11,
    level: "medium",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "How long does the full recognition process for a nursing qualification in Germany typically take?",
        opts: ["Two weeks to one month", "3 to 6 months", "One to two years", "More than three years"],
        fb: "The process typically takes 3 to 6 months after submitting complete documents, and may be longer in some states."
      },
      de: {
        q: "Wie lange dauert das vollständige Anerkennungsverfahren für eine Pflegequalifikation in Deutschland in der Regel?",
        opts: ["Zwei Wochen bis ein Monat", "3 bis 6 Monate", "Ein bis zwei Jahre", "Mehr als drei Jahre"],
        fb: "Das Verfahren dauert in der Regel 3 bis 6 Monate nach Einreichung der vollständigen Unterlagen und kann in einigen Bundesländern länger dauern."
      },
      ar: {
        q: "كم تستغرق عملية الاعتراف الكامل بشهادة التمريض في ألمانيا عادةً؟",
        opts: ["أسبوعان إلى شهر", "3 إلى 6 أشهر", "سنة إلى سنتين", "أكثر من ثلاث سنوات"],
        fb: "تستغرق العملية في الغالب من 3 إلى 6 أشهر بعد تقديم المستندات الكاملة، وقد تمتد في بعض الولايات."
      }
    }
  },
  {
    id: 12,
    level: "medium",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "Which of the following benefits does Germany offer to qualified foreign nurses?",
        opts: ["Temporary residency without renewal", "Renewable residence permit with a pathway to permanent residency", "Tourist visa only", "One-month work permit"],
        fb: "Nurses receive a renewable work residence permit, with the option to apply for permanent residency (Niederlassungserlaubnis) after 5 years."
      },
      de: {
        q: "Welche der folgenden Leistungen bietet Deutschland qualifizierten ausländischen Pflegekräften?",
        opts: ["Vorübergehende Aufenthaltserlaubnis ohne Verlängerung", "Verlängerbare Aufenthaltserlaubnis mit Weg zur dauerhaften Niederlassung", "Nur Touristenvisum", "Arbeitserlaubnis für einen Monat"],
        fb: "Pflegekräfte erhalten eine verlängerbare Arbeitsaufenthaltserlaubnis mit der Möglichkeit, nach 5 Jahren die Niederlassungserlaubnis zu beantragen."
      },
      ar: {
        q: "أي من المزايا التالية تُقدمها ألمانيا للممرضين الأجانب المؤهلين؟",
        opts: ["إقامة مؤقتة بدون تجديد", "تصريح إقامة قابل للتجديد مع مسار للإقامة الدائمة", "إقامة سياحية فقط", "تصريح عمل لمدة شهر واحد"],
        fb: "يحصل الممرضون على تصريح إقامة للعمل قابل للتجديد، مع إمكانية التقدم للإقامة الدائمة (Niederlassungserlaubnis) بعد 5 سنوات."
      }
    }
  },
  {
    id: 13,
    level: "hard",
    type: "scenario",
    ans: 1,
    locales: {
      en: {
        q: "Scenario: Ahmed graduated from an accredited nursing college and worked 3 years in a government hospital. His certificate is untranslated and he has A2 German. What should his first step be?",
        opts: ["Apply directly for a German work visa", "Improve his German to B2 and translate his documents first", "Search for a hospital that will accept him without conditions", "Obtain a postgraduate nursing degree"],
        fb: "The correct first step is raising his German to B2 and having all documents officially translated — both are non-negotiable prerequisites."
      },
      de: {
        q: "Szenario: Ahmed hat eine anerkannte Pflegeschule abgeschlossen und 3 Jahre in einem staatlichen Krankenhaus gearbeitet. Sein Zeugnis ist nicht übersetzt und er hat Deutschniveau A2. Was sollte sein erster Schritt sein?",
        opts: ["Direkt ein Arbeitsvisum für Deutschland beantragen", "Erst Deutsch auf B2 verbessern und Unterlagen übersetzen lassen", "Ein Krankenhaus suchen, das ihn ohne Bedingungen aufnimmt", "Einen Aufbaustudiengang in der Pflege absolvieren"],
        fb: "Der richtige erste Schritt ist die Verbesserung des Deutschniveaus auf B2 und die beglaubigte Übersetzung aller Unterlagen — beides sind unverzichtbare Voraussetzungen."
      },
      ar: {
        q: "سيناريو: تخرّج أحمد من كلية تمريض معتمدة وعمل 3 سنوات في مستشفى حكومي. شهادته غير مترجمة، ولديه مستوى A2 في الألمانية. ما هي الخطوة الأولى التي يجب أن يتخذها؟",
        opts: ["التقديم مباشرةً على تأشيرة العمل في ألمانيا", "تحسين مستوى الألمانية إلى B2 وترجمة وثائقه أولاً", "البحث عن مستشفى يقبله دون شروط", "الحصول على شهادة دراسات عليا في التمريض"],
        fb: "الخطوة الصحيحة هي رفع مستوى اللغة الألمانية إلى B2 وترجمة جميع المستندات بشكل معتمد — وهما شرطان أساسيان لا يمكن تجاوزهما."
      }
    }
  },
  {
    id: 14,
    level: "hard",
    type: "scenario",
    ans: 1,
    locales: {
      en: {
        q: "Scenario: Mona applied for recognition in Bavaria and was told there are 'substantial differences' between her qualification and German standards. What options are available to her?",
        opts: ["Apply in a different state only", "Pass a competency test (Kenntnisprüfung) or complete an adaptation course (Anpassungslehrgang)", "Re-study from scratch in Germany", "Only appeal to the courts"],
        fb: "When substantial differences exist, the applicant may choose between sitting the Kenntnisprüfung (competency exam) or completing an Anpassungslehrgang (adaptation training) to bridge the gaps."
      },
      de: {
        q: "Szenario: Mona hat einen Anerkennungsantrag in Bayern gestellt und wurde informiert, dass 'wesentliche Unterschiede' zwischen ihrer Qualifikation und den deutschen Standards bestehen. Welche Möglichkeiten hat sie?",
        opts: ["Nur in einem anderen Bundesland bewerben", "Kenntnisprüfung ablegen oder Anpassungslehrgang absolvieren", "In Deutschland von vorne studieren", "Nur vor Gericht Einspruch einlegen"],
        fb: "Bei wesentlichen Unterschieden kann zwischen der Kenntnisprüfung oder dem Anpassungslehrgang gewählt werden, um die Lücken zu schließen."
      },
      ar: {
        q: "سيناريو: تقدمت منى بطلب اعتراف في ولاية بافاريا وأُبلغت بوجود 'فروق جوهرية' بين شهادتها والمعايير الألمانية. ما الخيارات المتاحة أمامها؟",
        opts: ["التقدم في ولاية مختلفة فقط", "اجتياز اختبار كفاءة (Kenntnisprüfung) أو إتمام تدريب تكيّفي (Anpassungslehrgang)", "إعادة الدراسة من الصفر في ألمانيا", "رفض القرار والاستئناف لدى المحاكم فقط"],
        fb: "عند وجود فروق جوهرية، يُتاح للمتقدم الاختيار بين اجتياز اختبار الكفاءة (Kenntnisprüfung) أو إتمام برنامج تدريبي تكيّفي (Anpassungslehrgang) لسد الفجوات."
      }
    }
  },
  {
    id: 15,
    level: "hard",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "What is the difference between Berufserlaubnis and Berufsanerkennung in the German nursing pathway?",
        opts: ["No difference — just two names for the same document", "Berufserlaubnis is a temporary work licence during recognition; Berufsanerkennung is full permanent recognition", "Berufsanerkennung is only for nurses; Berufserlaubnis covers all medical professions", "Berufserlaubnis is only granted after 5 years of experience"],
        fb: "The distinction is important: Berufserlaubnis is a temporary work licence issued during processing, while Berufsanerkennung is the full, permanent recognition of qualifications."
      },
      de: {
        q: "Was ist der Unterschied zwischen Berufserlaubnis und Berufsanerkennung im deutschen Pflegeweg?",
        opts: ["Kein Unterschied — nur zwei Namen für dasselbe Dokument", "Berufserlaubnis ist eine vorläufige Arbeitserlaubnis während der Anerkennung; Berufsanerkennung ist die vollständige dauerhafte Anerkennung", "Berufsanerkennung gilt nur für Pflegekräfte; Berufserlaubnis für alle medizinischen Berufe", "Berufserlaubnis wird erst nach 5 Jahren Erfahrung erteilt"],
        fb: "Die Berufserlaubnis ist eine vorläufige Arbeitserlaubnis während des Verfahrens, während die Berufsanerkennung die vollständige und dauerhafte Anerkennung der Qualifikationen darstellt."
      },
      ar: {
        q: "ما الفرق بين 'Berufserlaubnis' و'Berufsanerkennung' في مسار التمريض الألماني؟",
        opts: ["لا فرق بينهما، مجرد اسمان لنفس الوثيقة", "Berufserlaubnis ترخيص مؤقت للعمل أثناء انتظار الاعتراف، و Berufsanerkennung هو الاعتراف الكامل الدائم", "Berufsanerkennung للممرضين فقط، و Berufserlaubnis لجميع المهن الطبية", "Berufserlaubnis يُمنح فقط بعد 5 سنوات خبرة"],
        fb: "التمييز مهم جداً: Berufserlaubnis ترخيص عمل مؤقت يُمنح خلال فترة المعالجة، بينما Berufsanerkennung هو الاعتراف الكامل والدائم بالمؤهلات."
      }
    }
  },
  {
    id: 16,
    level: "hard",
    type: "scenario",
    ans: 1,
    locales: {
      en: {
        q: "Scenario: Yousef has a job offer from a hospital in Berlin but has not yet completed the recognition process. Can he travel and start work?",
        opts: ["Yes, a job offer alone allows immediate travel", "Yes, he can travel and work under a Berufserlaubnis (temporary licence) while recognition is completed", "No, full recognition must be completed before travelling", "Yes, but only as a volunteer"],
        fb: "Travel and work are possible under the temporary licence (Berufserlaubnis) with a formal job offer — a common pathway that enables early professional integration."
      },
      de: {
        q: "Szenario: Yousef hat ein Jobangebot von einem Berliner Krankenhaus, hat aber das Anerkennungsverfahren noch nicht abgeschlossen. Kann er reisen und arbeiten?",
        opts: ["Ja, ein Jobangebot allein erlaubt sofortige Einreise", "Ja, er kann mit einer Berufserlaubnis (vorläufige Erlaubnis) reisen und arbeiten, bis die Anerkennung abgeschlossen ist", "Nein, die vollständige Anerkennung muss vor der Einreise abgeschlossen sein", "Ja, aber nur ehrenamtlich"],
        fb: "Reisen und Arbeiten sind mit einer vorläufigen Erlaubnis (Berufserlaubnis) und einem formellen Jobangebot möglich — ein häufiger Weg zur frühzeitigen beruflichen Integration."
      },
      ar: {
        q: "سيناريو: حصل يوسف على عرض عمل من مستشفى في برلين، لكن لم يُكمل بعد إجراءات الاعتراف. هل يمكنه السفر والبدء بالعمل؟",
        opts: ["نعم، بمجرد الحصول على عرض العمل يمكن السفر فوراً", "نعم، يمكنه السفر والعمل بموجب Berufserlaubnis (ترخيص مؤقت) ريثما يكتمل الاعتراف", "لا، يجب اكتمال الاعتراف الكامل قبل السفر", "نعم، لكن يجب أن يعمل متطوعاً فقط"],
        fb: "يمكن السفر والعمل بموجب الترخيص المؤقت (Berufserlaubnis) مع عرض عمل رسمي، وهو مسار شائع يتيح الاندماج المهني المبكر."
      }
    }
  },
  {
    id: 17,
    level: "medium",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "What does an Anpassungslehrgang (adaptation programme) typically involve?",
        opts: ["Learning the German language only", "Practical training in a German healthcare facility to bridge gaps with local standards", "Sitting a comprehensive written nursing exam", "Attending university lectures for two years"],
        fb: "The programme involves supervised practical training inside a German healthcare facility, lasting between 3 months and one year depending on the identified gaps."
      },
      de: {
        q: "Was umfasst ein Anpassungslehrgang typischerweise?",
        opts: ["Nur Deutschlernen", "Praktische Ausbildung in einer deutschen Gesundheitseinrichtung zur Schließung von Lücken gegenüber lokalen Standards", "Ablegen einer umfassenden schriftlichen Pflegeprüfung", "Universitätsvorlesungen für zwei Jahre"],
        fb: "Das Programm umfasst eine betreute praktische Ausbildung in einer deutschen Gesundheitseinrichtung, die je nach festgestellten Lücken zwischen 3 Monaten und einem Jahr dauert."
      },
      ar: {
        q: "ما الذي يشمله عادةً 'Anpassungslehrgang' (برنامج التكيّف المهني)؟",
        opts: ["تعلّم اللغة الألمانية فقط", "تدريب عملي في مستشفى ألماني لسد الفجوات مع المعايير المحلية", "اجتياز امتحان تحريري شامل في التمريض", "حضور محاضرات جامعية لمدة سنتين"],
        fb: "يتضمن البرنامج تدريباً عملياً موجَّهاً داخل منشأة صحية ألمانية بإشراف ممرض مؤهل، ومدته تتراوح بين 3 أشهر وسنة حسب الفجوات المحددة."
      }
    }
  },
  {
    id: 18,
    level: "easy",
    type: "mc",
    ans: 1,
    locales: {
      en: {
        q: "Which of the following documents must carry an Apostille stamp for submission in Germany?",
        opts: ["Personal photos", "Academic certificates and official documents", "CV", "Cover letter"],
        fb: "Germany requires academic certificates and official documents to carry an Apostille stamp from the competent authority in the issuing country."
      },
      de: {
        q: "Welche der folgenden Dokumente müssen für die Einreichung in Deutschland mit einer Apostille versehen sein?",
        opts: ["Passfotos", "Akademische Zeugnisse und offizielle Dokumente", "Lebenslauf", "Anschreiben"],
        fb: "Deutschland verlangt, dass akademische Zeugnisse und offizielle Dokumente mit einem Apostille-Stempel der zuständigen Behörde im Ausstellungsland versehen sind."
      },
      ar: {
        q: "أي من المستندات التالية يجب أن تكون مُصادقاً عليها بـ 'أبوستيل' للتقديم في ألمانيا؟",
        opts: ["الصور الشخصية", "الشهادات الأكاديمية والوثائق الرسمية", "السيرة الذاتية", "خطاب النية"],
        fb: "تتطلب ألمانيا أن تكون الشهادات الأكاديمية والوثائق الرسمية مُصادقاً عليها بختم الأبوستيل من الجهة المختصة في بلد الإصدار."
      }
    }
  },
  {
    id: 19,
    level: "hard",
    type: "scenario",
    ans: 1,
    locales: {
      en: {
        q: "Scenario: Sara works in psychiatric nursing in her home country. The programme told her Germany only recognises general nursing, not specialisations. What does this mean in practice?",
        opts: ["She cannot apply at all due to her specialisation", "She can apply as a general nurse, and may be required to complete additional training hours to cover non-specialised areas", "She must obtain a new general nursing certificate from scratch", "Her specialisation is equivalent to a medical degree in Germany"],
        fb: "Germany recognises the unified title 'Gesundheits- und Krankenpfleger' (healthcare and nursing). Specialist nurses apply as general nurses and may have supplementary requirements."
      },
      de: {
        q: "Szenario: Sara arbeitet in der psychiatrischen Pflege in ihrem Heimatland. Das Programm teilte ihr mit, dass Deutschland nur die allgemeine Pflege anerkennt, keine Spezialisierungen. Was bedeutet das in der Praxis?",
        opts: ["Sie kann sich wegen ihrer Spezialisierung gar nicht bewerben", "Sie kann sich als Allgemeinpflegerin bewerben und muss möglicherweise zusätzliche Ausbildungsstunden in nicht-spezialisierten Bereichen absolvieren", "Sie muss ein neues Allgemeinpflegediplom von Grund auf erwerben", "Ihre Spezialisierung entspricht einem Medizinstudium in Deutschland"],
        fb: "Deutschland erkennt die einheitliche Berufsbezeichnung 'Gesundheits- und Krankenpfleger' an. Spezialisierte Pflegekräfte bewerben sich als Allgemeinpflegekräfte und können ergänzende Anforderungen haben."
      },
      ar: {
        q: "سيناريو: تعمل سارة في تخصص التمريض النفسي في بلدها. أخبرتها إدارة البرنامج أن ألمانيا تعترف بالتمريض العام فقط، وليس بالتخصصات. ما الذي يعنيه هذا عملياً؟",
        opts: ["لا يمكنها التقديم إطلاقاً بسبب تخصصها", "يمكنها التقديم كممرضة عامة، وقد تُطلب منها ساعات تدريبية إضافية لتغطية مجالات غير متخصصة", "يجب أن تحصل على شهادة تمريض عامة جديدة من الصفر", "تخصصها يُعادل شهادة طبيب في ألمانيا"],
        fb: "ألمانيا تعترف بمسمى 'Gesundheits- und Krankenpfleger' (ممرض رعاية صحية) كتصنيف موحّد. ممرضو التخصصات يتقدمون كممرضين عامين مع احتمال وجود متطلبات تكميلية."
      }
    }
  },
  {
    id: 20,
    level: "hard",
    type: "mc",
    ans: 2,
    locales: {
      en: {
        q: "What is the legally regulated maximum weekly working hours for nurses in Germany?",
        opts: ["30 hours", "40 hours", "48 hours", "60 hours"],
        fb: "The German Working Hours Act (Arbeitszeitgesetz) sets the maximum at 48 hours per week, with strict rules on rest periods between shifts."
      },
      de: {
        q: "Was ist die gesetzlich geregelte maximale wöchentliche Arbeitszeit für Pflegekräfte in Deutschland?",
        opts: ["30 Stunden", "40 Stunden", "48 Stunden", "60 Stunden"],
        fb: "Das Arbeitszeitgesetz legt die maximale Arbeitszeit auf 48 Stunden pro Woche fest, mit strengen Vorschriften zu Ruhezeiten zwischen den Schichten."
      },
      ar: {
        q: "ما هو الحد الأقصى لساعات العمل الأسبوعية المنظّمة قانونياً للممرضين في ألمانيا؟",
        opts: ["30 ساعة", "40 ساعة", "48 ساعة", "60 ساعة"],
        fb: "يحدد قانون العمل الألماني (Arbeitszeitgesetz) الحد الأقصى بـ48 ساعة أسبوعياً، مع قيود صارمة على أوقات الراحة بين الورديات."
      }
    }
  }
];