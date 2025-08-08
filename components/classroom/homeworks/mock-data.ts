import type {
  ClassHomeworkOverview,
  Homework,
  HomeworkStats,
  HomeworkSubmission,
  StudentHomeworkSummary,
} from "./types";

// Algerian student names
const algerianStudentNames = [
  "Ahmed Benali",
  "Fatima Benaissa",
  "Mohamed Khelifi",
  "Aicha Boumediene",
  "Youcef Hamidi",
  "Khadija Meziane",
  "Omar Belkacem",
  "Samira Cherif",
  "Karim Boukhalfa",
  "Nadia Benabdallah",
  "Rachid Mammeri",
  "Leila Boudjelal",
  "Sofiane Zidane",
  "Amina Benslimane",
  "Tarek Boudiaf",
  "Yasmine Hadj",
  "Bilal Mebarki",
  "Soraya Benali",
  "Amine Bensalem",
  "Houria Benabbes",
  "Farid Bouazza",
  "Malika Benkhaled",
  "Samir Benacer",
  "Djamila Benaouda",
  "Walid Benabdellah",
  "Zineb Benmohamed",
  "Hicham Benali",
  "Nawal Bensaid",
  "Riad Boukerche",
  "Siham Benabdallah",
  "Mourad Benali",
  "Widad Benaissa",
  "Adel Khelifi",
  "Sabrina Boumediene",
  "Nabil Hamidi",
  "Karima Meziane",
  "Djamel Belkacem",
  "Souad Cherif",
  "Farouk Boukhalfa",
  "Lamia Benabdallah",
];

// Algerian teacher names
const algerianTeacherNames = [
  "Prof. Benali Ahmed",
  "Prof. Khelifi Fatima",
  "Prof. Meziane Omar",
  "Prof. Boumediene Aicha",
  "Prof. Hamidi Youcef",
  "Prof. Cherif Samira",
  "Prof. Belkacem Omar",
  "Prof. Boukhalfa Karim",
  "Prof. Benabdallah Nadia",
  "Prof. Mammeri Rachid",
  "Prof. Boudjelal Leila",
  "Prof. Zidane Sofiane",
];

// Algerian classes
const algerianClasses = [
  { id: "class_1", name: "1ère AS Sciences" },
  { id: "class_2", name: "1ère AS Lettres" },
  { id: "class_3", name: "2ème AS Sciences" },
  { id: "class_4", name: "2ème AS Lettres" },
  { id: "class_5", name: "3ème AS Sciences" },
  { id: "class_6", name: "3ème AS Lettres" },
  { id: "class_7", name: "Terminal Sciences" },
  { id: "class_8", name: "Terminal Lettres" },
  { id: "class_9", name: "1ère AM" },
  { id: "class_10", name: "2ème AM" },
  { id: "class_11", name: "3ème AM" },
  { id: "class_12", name: "4ème AM" },
];

// Algerian subjects
const algerianSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Arabic",
  "French",
  "English",
  "History",
  "Geography",
  "Islamic Studies",
  "Philosophy",
];

// Homework titles in French/Arabic context
const homeworkTitles = {
  Mathematics: [
    "Exercices sur les fonctions logarithmiques",
    "Problèmes de géométrie dans l'espace",
    "Calcul intégral - Applications",
    "Étude de fonctions polynomiales",
    "Résolution d'équations différentielles",
  ],
  Physics: [
    "Étude du mouvement rectiligne uniformément varié",
    "Lois de Newton - Applications pratiques",
    "Oscillations mécaniques libres",
    "Électrostatique - Champ électrique",
    "Ondes mécaniques progressives",
  ],
  Chemistry: [
    "Réactions d'oxydoréduction",
    "Équilibres chimiques en solution",
    "Chimie organique - Alcanes et alcènes",
    "Cinétique chimique",
    "Électrolyse et piles électrochimiques",
  ],
  Biology: [
    "La respiration cellulaire",
    "La photosynthèse chez les végétaux",
    "Le système nerveux humain",
    "La génétique mendélienne",
    "L'évolution des espèces",
  ],
  Arabic: [
    "تحليل نص أدبي من العصر الجاهلي",
    "الشعر في العصر الأموي",
    "قواعد النحو - الإعراب",
    "البلاغة العربية - التشبيه والاستعارة",
    "الأدب الأندلسي",
  ],
  French: [
    "Analyse d'un texte de Molière",
    "La poésie romantique française",
    "Rédaction d'un essai argumentatif",
    "Étude de 'L'Étranger' de Camus",
    "Grammaire française - Les temps du récit",
  ],
  English: [
    "Shakespeare's Hamlet - Character Analysis",
    "Essay Writing Techniques",
    "Grammar Review - Conditional Sentences",
    "Reading Comprehension Practice",
    "Vocabulary Building Exercises",
  ],
  History: [
    "La révolution algérienne 1954-1962",
    "L'Empire ottoman et l'Algérie",
    "La colonisation française en Algérie",
    "Les mouvements de libération en Afrique",
    "L'Algérie indépendante - Défis et réalisations",
  ],
  Geography: [
    "Le relief algérien",
    "Les ressources hydriques en Algérie",
    "L'agriculture dans les hauts plateaux",
    "L'urbanisation au Maghreb",
    "Les enjeux environnementaux au Sahara",
  ],
  "Islamic Studies": [
    "أحكام الصلاة في الإسلام",
    "السيرة النبوية - الهجرة",
    "القرآن الكريم - تفسير سورة البقرة",
    "الأخلاق الإسلامية",
    "تاريخ الخلفاء الراشدين",
  ],
  Philosophy: [
    "مفهوم الحرية في الفلسفة",
    "الفلسفة اليونانية القديمة",
    "فلسفة ابن خلدون",
    "الوجودية والإنسان",
    "فلسفة العلوم الحديثة",
  ],
};

// Generate mock homeworks
export const mockHomeworks: Homework[] = [];

// Generate homeworks for the last 30 days and next 30 days
for (let i = -15; i < 45; i++) {
  const assignedDate = new Date();
  assignedDate.setDate(assignedDate.getDate() + i - 30);

  const dueDate = new Date(assignedDate);
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 3); // 3-17 days to complete

  const subject =
    algerianSubjects[Math.floor(Math.random() * algerianSubjects.length)];
  const classInfo =
    algerianClasses[Math.floor(Math.random() * algerianClasses.length)];
  const teacher =
    algerianTeacherNames[
      Math.floor(Math.random() * algerianTeacherNames.length)
    ];
  const titles = homeworkTitles[subject as keyof typeof homeworkTitles] || [
    "Devoir général",
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];

  const types = [
    "assignment",
    "project",
    "reading",
    "exercise",
    "research",
  ] as const;
  const priorities = ["low", "medium", "high", "urgent"] as const;
  const difficulties = ["easy", "medium", "hard"] as const;

  const type = types[Math.floor(Math.random() * types.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const difficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];

  // Determine status based on dates
  const now = new Date();
  let status: "draft" | "assigned" | "in_progress" | "completed" | "overdue";

  if (assignedDate > now) {
    status = "draft";
  } else if (dueDate < now) {
    status = Math.random() > 0.3 ? "completed" : "overdue";
  } else {
    status = Math.random() > 0.5 ? "assigned" : "in_progress";
  }

  const estimatedDuration =
    type === "project"
      ? Math.floor(Math.random() * 300) + 180 // 3-8 hours for projects
      : Math.floor(Math.random() * 120) + 30; // 30min-2.5hours for others

  const totalMarks =
    Math.random() > 0.3 ? Math.floor(Math.random() * 15) + 5 : undefined; // 5-20 marks

  mockHomeworks.push({
    id: `homework_${i + 15}`,
    title,
    description: `Devoir de ${subject} portant sur ${title.toLowerCase()}. Travail à rendre pour le ${dueDate.toLocaleDateString()}.`,
    subject,
    classId: classInfo.id,
    className: classInfo.name,
    teacherId: `teacher_${Math.floor(Math.random() * algerianTeacherNames.length)}`,
    teacherName: teacher,
    assignedDate: assignedDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    dueTime: Math.random() > 0.5 ? "23:59" : undefined,
    type,
    priority,
    status,
    totalMarks,
    instructions: `Instructions détaillées pour ${title}. Respecter les consignes et la date limite.`,
    estimatedDuration,
    difficulty,
    tags: [subject.toLowerCase(), type, difficulty],
    createdBy: teacher,
    createdAt: assignedDate.toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// Generate homework submissions
export const mockHomeworkSubmissions: HomeworkSubmission[] = [];

mockHomeworks.forEach((homework) => {
  if (homework.status !== "draft") {
    // Generate 20-35 submissions per homework
    const numStudents = Math.floor(Math.random() * 16) + 20;

    for (let i = 0; i < numStudents; i++) {
      const studentName = algerianStudentNames[i % algerianStudentNames.length];
      const dueDate = new Date(homework.dueDate);
      const now = new Date();

      // Determine submission status
      let status:
        | "not_submitted"
        | "submitted"
        | "late"
        | "graded"
        | "returned";
      let submittedAt: string | undefined;
      let isLate = false;
      let daysLate: number | undefined;

      const submissionRate = 0.85; // 85% submission rate
      const onTimeRate = 0.75; // 75% on-time rate

      if (Math.random() > submissionRate) {
        status = "not_submitted";
      } else {
        // Student submitted
        const isOnTime = Math.random() < onTimeRate;

        if (isOnTime) {
          // Submitted on time
          const submitDate = new Date(dueDate);
          submitDate.setDate(
            submitDate.getDate() - Math.floor(Math.random() * 5),
          ); // 0-5 days early
          submittedAt = submitDate.toISOString();
          status = homework.status === "completed" ? "graded" : "submitted";
        } else {
          // Submitted late
          const submitDate = new Date(dueDate);
          const lateDays = Math.floor(Math.random() * 7) + 1; // 1-7 days late
          submitDate.setDate(submitDate.getDate() + lateDays);

          if (submitDate <= now) {
            submittedAt = submitDate.toISOString();
            isLate = true;
            daysLate = lateDays;
            status = homework.status === "completed" ? "graded" : "late";
          } else {
            status = "not_submitted";
          }
        }
      }

      // Generate grade if graded
      let grade: number | undefined;
      let feedback: string | undefined;
      let gradedBy: string | undefined;
      let gradedAt: string | undefined;

      if (status === "graded" && homework.totalMarks) {
        const baseGrade = homework.totalMarks * (0.6 + Math.random() * 0.4); // 60-100% range
        const latePenalty = isLate ? Math.min(2, daysLate || 0) : 0; // -2 points max for being late
        grade = Math.max(0, Math.round(baseGrade - latePenalty));

        const feedbacks = [
          "Excellent travail, continuez ainsi !",
          "Bon travail, quelques améliorations possibles.",
          "Travail satisfaisant, respectez mieux les consignes.",
          "Effort insuffisant, revoyez les concepts de base.",
          "Très bon devoir, félicitations !",
          "Travail correct mais manque de détails.",
          "Bonne compréhension du sujet.",
        ];

        feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        gradedBy = homework.teacherName;
        gradedAt = new Date().toISOString();
      }

      mockHomeworkSubmissions.push({
        id: `submission_${homework.id}_${i}`,
        homeworkId: homework.id,
        studentId: `student_${i}`,
        studentName,
        submittedAt,
        status,
        content: submittedAt
          ? `Réponse de ${studentName} pour ${homework.title}`
          : undefined,
        grade,
        feedback,
        gradedBy,
        gradedAt,
        isLate,
        daysLate,
      });
    }
  }
});

// Generate homework stats
export const mockHomeworkStats: HomeworkStats[] = [];

mockHomeworks.forEach((homework) => {
  const submissions = mockHomeworkSubmissions.filter(
    (s) => s.homeworkId === homework.id,
  );

  if (submissions.length > 0) {
    const totalStudents = submissions.length;
    const submittedCount = submissions.filter(
      (s) => s.status !== "not_submitted",
    ).length;
    const notSubmittedCount = submissions.filter(
      (s) => s.status === "not_submitted",
    ).length;
    const lateCount = submissions.filter((s) => s.isLate).length;
    const gradedCount = submissions.filter((s) => s.status === "graded").length;

    const grades = submissions
      .filter((s) => s.grade !== undefined)
      .map((s) => s.grade!);
    const averageGrade =
      grades.length > 0
        ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
        : undefined;

    const submissionRate = (submittedCount / totalStudents) * 100;
    const onTimeRate = ((submittedCount - lateCount) / totalStudents) * 100;
    const completionRate = (gradedCount / totalStudents) * 100;

    mockHomeworkStats.push({
      id: `stats_${homework.id}`,
      homeworkId: homework.id,
      totalStudents,
      submittedCount,
      notSubmittedCount,
      lateCount,
      gradedCount,
      averageGrade,
      submissionRate,
      onTimeRate,
      completionRate,
      lastUpdated: new Date().toISOString(),
    });
  }
});

// Generate student homework summaries
export const mockStudentHomeworkSummary: StudentHomeworkSummary[] = [];

// Create unique students from submissions
const uniqueStudents = new Map<
  string,
  { id: string; name: string; classId: string; className: string }
>();

mockHomeworkSubmissions.forEach((submission) => {
  if (!uniqueStudents.has(submission.studentId)) {
    // Find a homework to get class info
    const homework = mockHomeworks.find((h) => h.id === submission.homeworkId);
    if (homework) {
      uniqueStudents.set(submission.studentId, {
        id: submission.studentId,
        name: submission.studentName,
        classId: homework.classId,
        className: homework.className,
      });
    }
  }
});

uniqueStudents.forEach((student) => {
  const studentSubmissions = mockHomeworkSubmissions.filter(
    (s) => s.studentId === student.id,
  );
  const studentHomeworks = mockHomeworks.filter((h) =>
    studentSubmissions.some((s) => s.homeworkId === h.id),
  );

  if (studentSubmissions.length > 0) {
    const totalHomeworks = studentHomeworks.length;
    const submittedCount = studentSubmissions.filter(
      (s) => s.status !== "not_submitted",
    ).length;
    const lateCount = studentSubmissions.filter((s) => s.isLate).length;
    const notSubmittedCount = studentSubmissions.filter(
      (s) => s.status === "not_submitted",
    ).length;

    const grades = studentSubmissions
      .filter((s) => s.grade !== undefined)
      .map((s) => s.grade!);
    const averageGrade =
      grades.length > 0
        ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
        : undefined;

    const submissionRate = (submittedCount / totalHomeworks) * 100;
    const onTimeRate = ((submittedCount - lateCount) / totalHomeworks) * 100;

    const recentSubmissions = studentSubmissions
      .filter((s) => s.submittedAt)
      .sort(
        (a, b) =>
          new Date(b.submittedAt!).getTime() -
          new Date(a.submittedAt!).getTime(),
      )
      .slice(0, 5);

    const now = new Date();
    const upcomingHomeworks = studentHomeworks
      .filter((h) => new Date(h.dueDate) > now && h.status === "assigned")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, 5);

    const overdueHomeworks = studentHomeworks
      .filter((h) => {
        const submission = studentSubmissions.find(
          (s) => s.homeworkId === h.id,
        );
        return (
          new Date(h.dueDate) < now &&
          (!submission || submission.status === "not_submitted")
        );
      })
      .slice(0, 5);

    mockStudentHomeworkSummary.push({
      id: `student_summary_${student.id}`,
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
      className: student.className,
      totalHomeworks,
      submittedCount,
      lateCount,
      notSubmittedCount,
      averageGrade,
      submissionRate,
      onTimeRate,
      recentSubmissions,
      upcomingHomeworks,
      overdueHomeworks,
    });
  }
});

// Generate class homework overviews
export const mockClassHomeworkOverview: ClassHomeworkOverview[] = [];

algerianClasses.forEach((classInfo) => {
  const classHomeworks = mockHomeworks.filter(
    (h) => h.classId === classInfo.id,
  );

  if (classHomeworks.length > 0) {
    const totalHomeworks = classHomeworks.length;
    const activeHomeworks = classHomeworks.filter(
      (h) => h.status === "assigned" || h.status === "in_progress",
    ).length;
    const completedHomeworks = classHomeworks.filter(
      (h) => h.status === "completed",
    ).length;
    const overdueHomeworks = classHomeworks.filter(
      (h) => h.status === "overdue",
    ).length;

    // Calculate average submission rate for this class
    const classStats = mockHomeworkStats.filter((s) =>
      classHomeworks.some((h) => h.id === s.homeworkId),
    );

    const averageSubmissionRate =
      classStats.length > 0
        ? classStats.reduce((sum, stat) => sum + stat.submissionRate, 0) /
          classStats.length
        : 0;

    const gradesWithValues = classStats.filter(
      (s) => s.averageGrade !== undefined,
    );
    const averageGrade =
      gradesWithValues.length > 0
        ? gradesWithValues.reduce((sum, stat) => sum + stat.averageGrade!, 0) /
          gradesWithValues.length
        : undefined;

    const recentHomeworks = classHomeworks
      .sort(
        (a, b) =>
          new Date(b.assignedDate).getTime() -
          new Date(a.assignedDate).getTime(),
      )
      .slice(0, 5);

    const now = new Date();
    const upcomingDeadlines = classHomeworks
      .filter((h) => new Date(h.dueDate) > now)
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, 5);

    mockClassHomeworkOverview.push({
      id: `class_overview_${classInfo.id}`,
      classId: classInfo.id,
      className: classInfo.name,
      totalHomeworks,
      activeHomeworks,
      completedHomeworks,
      overdueHomeworks,
      averageSubmissionRate,
      averageGrade,
      recentHomeworks,
      upcomingDeadlines,
    });
  }
});

// Sort arrays for better display
mockHomeworks.sort(
  (a, b) =>
    new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime(),
);
mockStudentHomeworkSummary.sort((a, b) => b.submissionRate - a.submissionRate);
mockClassHomeworkOverview.sort(
  (a, b) => b.averageSubmissionRate - a.averageSubmissionRate,
);
