const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Order = require('./models/Order');
const SourcingRequest = require('./models/SourcingRequest');
const Payment = require('./models/Payment');
const { sequelize, connectDB } = require('./config/db');
require('dotenv').config();

// Define associations
User.hasMany(Course, { foreignKey: 'instructorId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'courseLessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(SourcingRequest, { foreignKey: 'clientId', as: 'sourcingRequests' });
SourcingRequest.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await sequelize.sync({ force: true });
        console.log('Database cleared and synced!');

        // Create demo users
        const users = await User.bulkCreate([
            {
                name: 'Jean Dupont',
                email: 'client@mdla.bf',
                password: 'demo123',
                role: 'client',
                phone: '+226 70 12 34 56'
            },
            {
                name: 'Admin MDLA',
                email: 'admin@mdla.bf',
                password: 'admin123',
                role: 'admin',
                phone: '+226 25 36 29 52'
            },
            {
                name: 'Marie Kaboré',
                email: 'etudiant@mdla.bf',
                password: 'demo123',
                role: 'student',
                phone: '+226 70 98 76 54'
            },
            {
                name: 'Prof. Schmidt',
                email: 'prof@mdla.bf',
                password: 'demo123',
                role: 'prof',
                phone: '+226 70 11 22 33'
            },
            {
                name: 'Amadou Traoré',
                email: 'transit@mdla.bf',
                password: 'demo123',
                role: 'transit',
                phone: '+226 70 44 55 66'
            }
        ], { individualHooks: true });

        console.log('Users seeded!');

        // Create sample courses
        await Course.bulkCreate([
            {
                title: 'Allemand pour Débutants',
                instructorId: users[3].id,
                level: 'débutant',
                category: 'Langues',
                price: 45000,
                description: 'Apprenez les bases de la langue allemande',
                thumbnail: 'https://placehold.co/600x400?text=Allemand',
                lessons: [
                    { title: 'Introduction', content: 'Bienvenue au cours', duration: '10:00', isFree: true },
                    { title: 'Les salutations', content: 'Guten Tag, Wie geht es dir?', duration: '15:00' }
                ]
            },
            {
                title: 'Chinois Mandarin - Niveau Intermédiaire',
                instructorId: users[3].id,
                level: 'intermédiaire',
                category: 'Langues',
                price: 55000,
                description: 'Perfectionnez votre chinois mandarin',
                thumbnail: 'https://placehold.co/600x400?text=Chinois',
                lessons: [
                    { title: 'Révision', content: 'Révision des bases', duration: '20:00' }
                ]
            }
        ]);

        console.log('Courses seeded!');

        // Create sample orders
        await Order.bulkCreate([
            {
                userId: users[0].id,
                items: [
                    {
                        productId: 'bmw-x5',
                        name: 'BMW X5 xDrive30d',
                        quantity: 1,
                        price: 15000000,
                        image: 'https://placehold.co/600x400?text=BMW+X5'
                    }
                ],
                totalAmount: 15000000,
                trackingNumber: 'MDL-8842',
                type: 'vehicle',
                status: 'in_transit',
                paymentStatus: 'paid',
                paymentMethod: 'bank_transfer',
                shippingDetails: {
                    destination: 'Ouagadougou, Burkina Faso'
                },
                currentStep: 4,
                timeline: [
                    { step: 1, title: 'Commande Validée', date: '01 Déc 2025', status: 'completed', description: 'Acompte reçu. Dossier ouvert.' },
                    { step: 2, title: 'Achat & Enlèvement', date: '03 Déc 2025', status: 'completed', description: 'Véhicule récupéré à Berlin.' },
                    { step: 3, title: 'Transit vers le Port', date: '05 Déc 2025', status: 'completed', description: 'Arrivé à Hambourg.' },
                    { step: 4, title: 'Expédition Maritime', date: 'En cours', status: 'current', description: 'Navire : MSC LIRICA.' },
                    { step: 5, title: 'Dédouanement', date: 'Estimé 20 Déc 2025', status: 'pending', description: 'Port de Lomé/Cotonou.' },
                    { step: 6, title: 'Livraison Finale', date: '-', status: 'pending', description: 'Mise à disposition client.' }
                ]
            }
        ]);

        console.log('Orders seeded!');

        // Create Lessons for Course 1 (Intro au Transit)
        if (courses.length > 0) {
            await Lesson.bulkCreate([
                {
                    title: 'Introduction au transit',
                    content: 'Dans cette leçon, nous allons découvrir les bases du transit douanier. Le transit est un régime douanier qui permet le transport de marchandises sous douane.',
                    duration: 15,
                    order: 1,
                    isFreePreview: true,
                    courseId: courses[0].id
                },
                {
                    title: 'Les différents régimes douaniers',
                    content: 'Il existe plusieurs régimes douaniers : la mise à la consommation, l\'entrepôt, l\'admission temporaire, etc.',
                    duration: 25,
                    order: 2,
                    isFreePreview: false,
                    courseId: courses[0].id
                },
                {
                    title: 'Documents nécessaires',
                    content: 'Titre de transport, facture commerciale, liste de colisage, certificat d\'origine.',
                    duration: 20,
                    order: 3,
                    isFreePreview: false,
                    courseId: courses[0].id
                }
            ]);
            console.log('Lessons seeded!');
        }

        console.log('✅ Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
