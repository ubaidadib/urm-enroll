// TO UPDATE: Replace PLACEHOLDER_X URLs with real Instagram Reel URLs from @urmenroll
// Format: https://www.instagram.com/reel/REEL_ID/
// To find a Reel URL: open the Reel on Instagram → tap the three dots → Copy Link

export interface SuccessStory {
  id: string;
  instagramUrl: string; // Full Instagram Reel URL e.g. https://www.instagram.com/reel/XXXXX/
  studentName: string;
  originCountry: string; // e.g. "Lebanon"
  destinationCountry: string; // e.g. "Germany"
  program: string; // e.g. "Bachelor of Computer Science"
  university: string; // e.g. "TU Berlin"
  quote: {
    en: string;
    de: string;
    ar: string;
  };
}

export const successStories: SuccessStory[] = [
  {
    id: 'story-1',
    instagramUrl: 'https://www.instagram.com/reel/PLACEHOLDER_1/',
    studentName: 'Abdulhadi',
    originCountry: 'Lebanon',
    destinationCountry: 'Germany',
    program: 'Bachelor of Engineering',
    university: 'TU Munich',
    quote: {
      en: 'URM Enroll made my dream of studying in Germany a reality. The support was exceptional from day one.',
      de: 'URM Enroll hat meinen Traum, in Deutschland zu studieren, wahr gemacht. Die Unterstützung war von Anfang an außergewöhnlich.',
      ar: 'جعل URM Enroll حلمي بالدراسة في ألمانيا حقيقة. كان الدعم استثنائياً من اليوم الأول.'
    }
  },
  {
    id: 'story-2',
    instagramUrl: 'https://www.instagram.com/reel/PLACEHOLDER_2/',
    studentName: 'Ibrahim',
    originCountry: 'Syria',
    destinationCountry: 'Germany',
    program: 'Master of Business Administration',
    university: 'University of Hamburg',
    quote: {
      en: 'From application to arrival, every step was handled professionally. I could not have done it without them.',
      de: 'Von der Bewerbung bis zur Ankunft wurde jeder Schritt professionell begleitet. Ohne sie hätte ich es nicht geschafft.',
      ar: 'من التقديم حتى الوصول، تمت معالجة كل خطوة باحترافية. لم أكن لأفعل ذلك بدونهم.'
    }
  },
  {
    id: 'story-3',
    instagramUrl: 'https://www.instagram.com/reel/PLACEHOLDER_3/',
    studentName: 'Zeinab',
    originCountry: 'Lebanon',
    destinationCountry: 'Germany',
    program: 'Nursing Workforce Programme',
    university: 'University Hospital Frankfurt',
    quote: {
      en: 'The nursing pathway programme changed my life. I now have a career and a future in Germany.',
      de: 'Das Pflegeprogramm hat mein Leben verändert. Ich habe jetzt eine Karriere und eine Zukunft in Deutschland.',
      ar: 'غيّر برنامج مسار التمريض حياتي. لدي الآن مسيرة مهنية ومستقبل في ألمانيا.'
    }
  },
  {
    id: 'story-4',
    instagramUrl: 'https://www.instagram.com/reel/PLACEHOLDER_4/',
    studentName: 'Omar',
    originCountry: 'Jordan',
    destinationCountry: 'Germany',
    program: 'Bachelor of Computer Science',
    university: 'RWTH Aachen',
    quote: {
      en: 'I got into one of Germany\'s top technical universities. The team guided me through every document and deadline.',
      de: 'Ich wurde an einer der besten technischen Universitäten Deutschlands angenommen. Das Team hat mich durch jeden Schritt begleitet.',
      ar: 'التحقت بإحدى أفضل الجامعات التقنية في ألمانيا. أرشدني الفريق خلال كل وثيقة وموعد نهائي.'
    }
  },
  {
    id: 'story-5',
    instagramUrl: 'https://www.instagram.com/reel/PLACEHOLDER_5/',
    studentName: 'Sara',
    originCountry: 'Iraq',
    destinationCountry: 'UK',
    program: 'Master of International Relations',
    university: 'University of Birmingham',
    quote: {
      en: 'URM Enroll handled everything — visa, accommodation, university application. I just had to show up.',
      de: 'URM Enroll hat alles übernommen — Visum, Unterkunft, Universitätsbewerbung. Ich musste nur erscheinen.',
      ar: 'تولى URM Enroll كل شيء — التأشيرة والسكن والتقديم الجامعي. كل ما كان عليّ فعله هو الحضور.'
    }
  },
  {
    id: 'story-6',
    instagramUrl: 'https://www.instagram.com/reel/PLACEHOLDER_6/',
    studentName: 'Lara',
    originCountry: 'Lebanon',
    destinationCountry: 'Canada',
    program: 'Bachelor of Nursing',
    university: 'University of Toronto',
    quote: {
      en: 'Moving to Canada felt impossible until I found URM Enroll. They made the complex feel simple.',
      de: 'Der Umzug nach Kanada erschien unmöglich, bis ich URM Enroll fand. Sie haben das Komplexe einfach gemacht.',
      ar: 'كان الانتقال إلى كندا يبدو مستحيلاً حتى وجدت URM Enroll. لقد جعلوا الأمر المعقد يبدو بسيطاً.'
    }
  }
];