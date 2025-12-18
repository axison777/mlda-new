// Mock course enrollment data for students
export const mockEnrolledCourses = [
    {
        id: 1,
        title: 'Allemand pour Débutants - Niveau A1',
        instructor: 'Prof. Schmidt',
        level: 'A1',
        progress: 45,
        image: '/api/placeholder/400/300',
        totalLessons: 20,
        completedLessons: 9,
        lastAccessed: '2024-12-14',
        enrolledDate: '2024-11-01'
    },
    {
        id: 2,
        title: 'Allemand Intermédiaire - Niveau B1',
        instructor: 'Prof. Weber',
        level: 'B1',
        progress: 78,
        image: '/api/placeholder/400/300',
        totalLessons: 25,
        completedLessons: 19,
        lastAccessed: '2024-12-13',
        enrolledDate: '2024-10-15'
    },
    {
        id: 3,
        title: 'Allemand Professionnel - Business',
        instructor: 'Prof. Becker',
        level: 'B2-C1',
        progress: 100,
        image: '/api/placeholder/400/300',
        totalLessons: 30,
        completedLessons: 30,
        lastAccessed: '2024-11-28',
        enrolledDate: '2024-09-01',
        certificateUrl: '/certificates/business-german-certificate.pdf'
    }
];

// Mock courses created by teachers
export const mockTeacherCourses = [
    {
        id: 1,
        title: 'Allemand A1 - Débutants',
        status: 'published',
        students: 45,
        createdDate: '2024-10-01',
        publishedDate: '2024-10-05',
        description: 'Cours pour débutants complets'
    },
    {
        id: 2,
        title: 'Allemand B1 - Intermédiaire',
        status: 'published',
        students: 38,
        createdDate: '2024-09-15',
        publishedDate: '2024-09-20',
        description: 'Niveau intermédiaire avec focus conversation'
    },
    {
        id: 3,
        title: 'Business Deutsch - Professionnel',
        status: 'pending',
        students: 0,
        createdDate: '2024-12-10',
        description: 'Allemand des affaires pour professionnels'
    },
    {
        id: 4,
        title: 'Allemand C1 - Avancé',
        status: 'draft',
        students: 0,
        createdDate: '2024-12-14',
        description: 'Cours avancé en préparation'
    },
    {
        id: 5,
        title: 'Préparation TELC B2',
        status: 'pending',
        students: 0,
        createdDate: '2024-12-12',
        description: 'Préparation à l\'examen TELC B2'
    }
];
