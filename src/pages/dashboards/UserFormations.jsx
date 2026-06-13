import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Search, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const UserFormations = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const { data } = await api.get('/enrollments');
                setEnrollments(data);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mdla-yellow"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tight">Mes Formations</h1>
                    <p className="text-gray-500 font-medium">Reprenez votre apprentissage là où vous l'avez laissé.</p>
                </div>
            </div>

            {enrollments.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <GraduationCap className="w-12 h-12 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Vous n'avez pas encore de formations</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Découvrez notre catalogue de cours et commencez à apprendre l'allemand dès aujourd'hui.</p>
                    <Link 
                        to="/formations"
                        className="bg-mdla-yellow text-mdla-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors inline-block"
                    >
                        Explorer les cours
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                            <div className="h-48 relative bg-gray-200">
                                {enrollment.course.thumbnail ? (
                                    <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <BookOpen className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {enrollment.progress}%
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">{enrollment.course.level}</span>
                                <h3 className="text-lg font-black text-gray-900 mb-4 line-clamp-2">{enrollment.course.title}</h3>
                                
                                <div className="mt-auto">
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                                        <div 
                                            className="bg-mdla-yellow h-2 rounded-full" 
                                            style={{ width: `${enrollment.progress}%` }}
                                        ></div>
                                    </div>

                                    <Link 
                                        to={`/dashboard/cours/${enrollment.courseId}`}
                                        className="w-full bg-gray-50 text-gray-900 border border-gray-200 py-3 rounded-xl font-bold hover:bg-mdla-black hover:text-white hover:border-transparent transition-all flex justify-center items-center gap-2 group"
                                    >
                                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        {enrollment.progress === 0 ? 'Commencer' : 'Continuer'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserFormations;
