import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, demoAccounts } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on role
            if (result.user.role === 'student') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    const handleDemoLogin = async (email, password) => {
        setFormData({ ...formData, email, password });
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.user.role === 'student') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-md w-full">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-mdla-yellow rounded-lg p-4 mb-4">
                            <LogIn className="w-12 h-12 text-mdla-black" />
                        </div>
                        <h2 className="text-3xl font-bold text-mdla-black">
                            Connexion
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Accédez à votre espace MDLA
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-mdla-yellow border-gray-300 rounded focus:ring-mdla-yellow"
                                />
                                <span className="ml-2 text-sm text-gray-700">Se souvenir de moi</span>
                            </label>
                            <a href="#" className="text-sm text-mdla-yellow hover:text-yellow-600 font-semibold">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <p className="text-center mt-6 text-gray-600">
                        Pas encore de compte ?{' '}
                        <Link to="/inscription" className="text-mdla-yellow hover:text-yellow-600 font-semibold">
                            S'inscrire
                        </Link>
                    </p>

                    {/* Demo Accounts */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                            Comptes de démonstration
                        </p>
                        <div className="space-y-2">
                            {demoAccounts.map((account) => (
                                <button
                                    key={account.id}
                                    onClick={() => handleDemoLogin(account.email, account.role === 'admin' ? 'admin123' : 'demo123')}
                                    className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{account.name}</p>
                                            <p className="text-xs text-gray-600">{account.email}</p>
                                        </div>
                                        <span className="text-xs bg-mdla-yellow text-mdla-black px-2 py-1 rounded font-semibold">
                                            {account.role === 'admin' ? 'Admin' : account.role === 'student' ? 'Étudiant' : 'Client'}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Illustration */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-mdla-yellow to-yellow-400 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <h3 className="text-4xl font-bold text-mdla-black mb-6">
                        Bienvenue chez MDLA
                    </h3>
                    <p className="text-lg text-mdla-black/80 mb-8">
                        Votre partenaire de confiance pour l'Allemagne et l'Afrique
                    </p>
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-mdla-black rounded-full flex items-center justify-center">
                                <span className="text-mdla-yellow font-bold">✓</span>
                            </div>
                            <p className="text-mdla-black">Formation en allemand</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-mdla-black rounded-full flex items-center justify-center">
                                <span className="text-mdla-yellow font-bold">✓</span>
                            </div>
                            <p className="text-mdla-black">Import/Export de véhicules</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-mdla-black rounded-full flex items-center justify-center">
                                <span className="text-mdla-yellow font-bold">✓</span>
                            </div>
                            <p className="text-mdla-black">Services de traduction</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
