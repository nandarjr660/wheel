/** Bilingual translations — Indonesian (id) + English (en) */

export type Lang = 'id' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  id: {
    // Header
    'header.badge': 'Smart Classroom AI Edition',
    'header.title.line1': 'Roda Keberuntungan',
    'header.title.line2': 'Kelas',

    // Setup Materi
    'setup.heading': 'Setup Materi',
    'setup.topicLabel': 'Topik Materi',
    'setup.topicPlaceholder': 'Contoh: Fotosintesis',
    'setup.level': 'Jenjang',
    'setup.grade': 'Kelas/Smt',
    'setup.aiChallenge': 'Tantangan AI',
    'setup.aiOn': 'ON',
    'setup.aiOff': 'OFF',
    'setup.aiTooltipOn': 'ON:',
    'setup.aiTooltipOnDesc': 'AI membuat soal untuk siswa terpilih',
    'setup.aiTooltipOff': 'OFF:',
    'setup.aiTooltipOffDesc': 'hanya menampilkan nama pemenang',

    // Daftar Siswa
    'students.heading': 'Daftar Siswa',
    'students.label': 'Siswa Aktif',
    'students.placeholder': 'Andi, Budi, Citra...',
    'students.update': 'UPDATE RODA',
    'students.empty': 'Tambahkan siswa terlebih dahulu',
    'students.count': '{n} siswa aktif',

    // Wheel
    'wheel.ariaLabel': 'Roda keberuntungan dengan {n} siswa',
    'wheel.spin': 'PUTAR!',
    'wheel.spinning': 'MEMUTAR...',
    'wheel.winner': 'Pemenang',
    'wheel.challenge': 'Tantangan AI',
    'wheel.challengeLoading': 'AI sedang menyiapkan tantangan seru...',
    'wheel.challengeError': 'Gagal mendapat tantangan',
    'wheel.retry': 'COBA LAGI',
    'wheel.viewAnswer': 'LIHAT JAWABAN',
    'wheel.answer': 'Jawaban',
    'wheel.close': 'TUTUP',
    'wheel.removeAndClose': 'HAPUS & TUTUP',
    'wheel.undoRemoved': '{name} telah dihapus',
    'wheel.undo': 'Urungkan',

    // Welcome popup
    'welcome.title': 'Selamat Datang di Roda Keberuntungan!',
    'welcome.desc': 'Jangan lupa follow Instagram kami ya',
    'welcome.follow': 'Follow @hsmnandar',
    'welcome.skip': 'Lewati',

    // HowTo
    'howto.heading': 'Cara Menggunakan',
    'howto.step1.title': 'Input Nama Siswa',
    'howto.step1.desc': 'Masukkan nama-nama siswa dipisahkan dengan koma pada kolom "Daftar Siswa". Contoh: Andi, Budi, Siti, Dewi.',
    'howto.step2.title': 'Setup Materi',
    'howto.step2.desc': 'Masukkan topik materi pelajaran, pilih jenjang (SD/SMP/SMA/Universitas), dan tentukan kelas atau semester.',
    'howto.step3.title': 'Aktifkan AI Challenge',
    'howto.step3.desc': 'Aktifkan toggle "Tantangan AI" jika ingin siswa yang terpilih mendapatkan soal dari AI. Nonaktifkan jika hanya ingin menampilkan nama pemenang.',
    'howto.step4.title': 'Putar Roda',
    'howto.step4.desc': 'Klik tombol "PUTAR!" untuk memutar roda. Tunggu hingga roda berhenti dan pemenang ditampilkan dengan confetti.',
    'howto.step5.title': 'Lihat Tantangan AI',
    'howto.step5.desc': 'Jika AI Challenge aktif, soal tantangan akan ditampilkan. Klik "LIHAT JAWABAN" untuk melihat jawaban yang benar.',

    // Features
    'features.heading': 'Fitur Unggulan',
    'features.wheel': 'Canvas-Rendered Wheel',
    'features.wheelDesc': 'Roda berputar dengan kualitas Retina/HiDPI support',
    'features.ai': 'AI-Powered Challenge',
    'features.aiDesc': 'Soal otomatis menggunakan Google Gemini AI',
    'features.confetti': 'Confetti Animation',
    'features.confettiDesc': 'Efek confetti meriah saat pemenang terpilih',
    'features.responsive': 'Responsive Design',
    'features.responsiveDesc': 'Tampilan optimal di mobile dan desktop',
    'features.theme': 'Dark & Light Mode',
    'features.themeDesc': 'Theme toggle sesuai preferensi pengguna',
    'features.sharing': 'Social Sharing',
    'features.sharingDesc': 'Share ke WhatsApp dan Facebook',

    // FAQ
    'faq.heading': 'Pertanyaan Umum (FAQ)',
    'faq.q1': 'Apa itu Roda Keberuntungan Kelas?',
    'faq.a1': 'Roda Keberuntungan Kelas adalah aplikasi web interaktif yang memungkinkan guru memutar roda keberuntungan untuk memilih siswa secara acak, dilengkapi dengan tantangan AI menggunakan Google Gemini untuk membuat soal pelajaran yang seru. Cocok untuk ice breaking dan pembelajaran aktif di kelas SD, SMP, SMA, maupun Universitas.',
    'faq.q2': 'Bagaimana cara menggunakan?',
    'faq.a2': 'Masukkan nama-nama siswa dipisahkan dengan koma, pilih jenjang dan kelas, lalu klik tombol PUTAR untuk memutar roda. Siswa yang terpilih akan mendapatkan tantangan AI berupa soal pelajaran yang relevan dengan topik yang diinput.',
    'faq.q3': 'Apakah aplikasi ini gratis?',
    'faq.a3': 'Ya, aplikasi ini 100% gratis. Anda hanya membutuhkan browser modern untuk mengaksesnya. Fitur AI menggunakan Google Gemini yang tersedia secara gratis.',
    'faq.q4': 'Jenjang apa saja yang didukung?',
    'faq.a4': 'Aplikasi mendukung jenjang SD (Kelas 1-6), SMP (Kelas VII-IX), SMA/SMK (Kelas X-XII), dan Universitas (Semester 1, 3, 5, 7). Setiap jenjang memiliki opsi kelas yang sesuai.',
    'faq.q5': 'Bagaimana fitur AI Challenge bekerja?',
    'faq.a5': 'Ketika fitur AI Challenge aktif, sistem akan mengirimkan topik, jenjang, dan kelas ke Google Gemini AI untuk membuat soal tantangan yang relevan. Siswa yang terpilih harus menjawab soal tersebut. Guru dapat melihat jawaban dengan mengklik tombol "LIHAT JAWABAN".',

    // Settings
    'settings.language': 'Bahasa',

    // Footer
    'footer.copyright': 'hasmunandar',

    // Theme toggle
    'theme.light': 'Tema Terang',
    'theme.dark': 'Tema Gelap',
  },

  en: {
    // Header
    'header.badge': 'Smart Classroom AI Edition',
    'header.title.line1': 'Class Fortune',
    'header.title.line2': 'Wheel',

    // Setup Materi
    'setup.heading': 'Setup Subject',
    'setup.topicLabel': 'Topic',
    'setup.topicPlaceholder': 'e.g.: Photosynthesis',
    'setup.level': 'Level',
    'setup.grade': 'Grade',
    'setup.aiChallenge': 'AI Challenge',
    'setup.aiOn': 'ON',
    'setup.aiOff': 'OFF',
    'setup.aiTooltipOn': 'ON:',
    'setup.aiTooltipOnDesc': 'AI creates a quiz for the selected student',
    'setup.aiTooltipOff': 'OFF:',
    'setup.aiTooltipOffDesc': 'only shows the winner name',

    // Daftar Siswa
    'students.heading': 'Student List',
    'students.label': 'Active Students',
    'students.placeholder': 'Andi, Budi, Citra...',
    'students.update': 'UPDATE WHEEL',
    'students.empty': 'Add students first',
    'students.count': '{n} active students',

    // Wheel
    'wheel.ariaLabel': 'Fortune wheel with {n} students',
    'wheel.spin': 'SPIN!',
    'wheel.spinning': 'SPINNING...',
    'wheel.winner': 'Winner',
    'wheel.challenge': 'AI Challenge',
    'wheel.challengeLoading': 'AI is preparing a fun challenge...',
    'wheel.challengeError': 'Failed to get challenge',
    'wheel.retry': 'TRY AGAIN',
    'wheel.viewAnswer': 'VIEW ANSWER',
    'wheel.answer': 'Answer',
    'wheel.close': 'CLOSE',
    'wheel.removeAndClose': 'REMOVE & CLOSE',
    'wheel.undoRemoved': '{name} has been removed',
    'wheel.undo': 'Undo',

    // Welcome popup
    'welcome.title': 'Welcome to the Class Fortune Wheel!',
    'welcome.desc': "Don't forget to follow our Instagram",
    'welcome.follow': 'Follow @hsmnandar',
    'welcome.skip': 'Skip',

    // HowTo
    'howto.heading': 'How to Use',
    'howto.step1.title': 'Enter Student Names',
    'howto.step1.desc': 'Enter student names separated by commas in the "Student List" field. Example: Andi, Budi, Siti, Dewi.',
    'howto.step2.title': 'Setup Subject',
    'howto.step2.desc': 'Enter the lesson topic, select the level (Elementary/Middle/High/University), and choose the grade or semester.',
    'howto.step3.title': 'Enable AI Challenge',
    'howto.step3.desc': 'Enable the "AI Challenge" toggle if you want the selected student to receive a quiz from AI. Disable it to only show the winner name.',
    'howto.step4.title': 'Spin the Wheel',
    'howto.step4.desc': 'Click the "SPIN!" button to spin the wheel. Wait for it to stop and the winner will be displayed with confetti.',
    'howto.step5.title': 'View AI Challenge',
    'howto.step5.desc': 'If AI Challenge is active, the quiz question will be displayed. Click "VIEW ANSWER" to see the correct answer.',

    // Features
    'features.heading': 'Key Features',
    'features.wheel': 'Canvas-Rendered Wheel',
    'features.wheelDesc': 'Spinning wheel with Retina/HiDPI support',
    'features.ai': 'AI-Powered Challenge',
    'features.aiDesc': 'Auto-generated quizzes using Google Gemini AI',
    'features.confetti': 'Confetti Animation',
    'features.confettiDesc': 'Exciting confetti effect when a winner is chosen',
    'features.responsive': 'Responsive Design',
    'features.responsiveDesc': 'Optimal display on mobile and desktop',
    'features.theme': 'Dark & Light Mode',
    'features.themeDesc': 'Theme toggle to suit your preference',
    'features.sharing': 'Social Sharing',
    'features.sharingDesc': 'Share via WhatsApp and Facebook',

    // FAQ
    'faq.heading': 'Frequently Asked Questions',
    'faq.q1': 'What is the Class Fortune Wheel?',
    'faq.a1': 'The Class Fortune Wheel is an interactive web application that allows teachers to spin a wheel to randomly select students, equipped with AI-powered challenges using Google Gemini to create exciting lesson quizzes. Perfect for ice breaking and active learning in elementary, middle, high school, and university classrooms.',
    'faq.q2': 'How do I use it?',
    'faq.a2': 'Enter student names separated by commas, select the level and grade, then click the SPIN button to spin the wheel. The selected student will receive an AI challenge with a lesson quiz relevant to the entered topic.',
    'faq.q3': 'Is this application free?',
    'faq.a3': 'Yes, this application is 100% free. You only need a modern browser to access it. The AI feature uses Google Gemini which is available for free.',
    'faq.q4': 'Which levels are supported?',
    'faq.a4': 'The application supports Elementary (Grades 1-6), Middle School (Grades 7-9), High School (Grades 10-12), and University (Semesters 1, 3, 5, 7). Each level has appropriate grade options.',
    'faq.q5': 'How does the AI Challenge feature work?',
    'faq.a5': 'When AI Challenge is active, the system sends the topic, level, and grade to Google Gemini AI to create a relevant challenge quiz. The selected student must answer the question. Teachers can view the answer by clicking the "VIEW ANSWER" button.',

    // Settings
    'settings.language': 'Language',

    // Footer
    'footer.copyright': 'hasmunandar',

    // Theme toggle
    'theme.light': 'Light Theme',
    'theme.dark': 'Dark Theme',
  },
};

export default translations;
