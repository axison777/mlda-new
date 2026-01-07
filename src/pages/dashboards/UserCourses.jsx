import React from 'react';
import { BookOpen, Clock, Award, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserCourses = () => {
    // Mock Data
    const courses = [
        {
            id: 1,
            title: 'Allemand B1 : Intermédiaire',
            progress: 65,
            lastLesson: 'Les verbes de modalité',
            image: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?auto=format&fit=crop&q=80&w=300&h=200',
            nextLesson: 'Les prépositions mixtes'
        },
        {
            id: 2,
            title: 'Allemand A2 : Élémentaire',
            progress: 100,
            lastLesson: 'Examen Final',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=300&h=200',
            completed: true
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mes Formations</h1>
                    <p className="text-gray-500">Retrouvez tous vos cours et suivez votre progression.</p>
                </div>
                <Link to="/formations" className="bg-mdla-yellow text-mdla-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                    Explorer d'autres cours
                </Link>
            </div>

            <div className="grid gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                                    {course.completed ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Award className="w-3 h-3" /> Terminé
                                        </span>
                                    ) : (
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">En cours</span>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm mb-4">
                                    {course.completed ? 'Cours complété le 12 Oct 2023' : `Prochaine leçon : ${course.nextLesson || course.lastLesson}`}
                                </p>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Progression</span>
                                    <span className="font-bold">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                    <div className="bg-mdla-yellow h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>

                                <div className="flex gap-3">
                                    <Link to={`/formations/${course.id}`} className="flex-1 bg-mdla-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                        <Play className="w-4 h-4" />
                                        {course.completed ? 'Revoir le cours' : 'Continuer'}
                                    </Link>
                                    {course.completed && (
                                        <button className="flex-1 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                            <Award className="w-4 h-4" />
                                            Certificat
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Aucun cours pour le moment</h3>
                        <p className="text-gray-500 mb-6">Inscrivez-vous à une formation pour commencer.</p>
                        <Link to="/formations" className="bg-mdla-yellow text-mdla-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
                            Voir le catalogue
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCourses;
