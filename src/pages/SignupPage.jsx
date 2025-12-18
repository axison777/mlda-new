import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Le téléphone est requis';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Vous devez accepter les conditions générales';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        const result = await signup(formData);

        if (result.success) {
            navigate('/');
        } else {
            setErrors({ general: result.error });
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Image/Illustration */}
            <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-mdla-yellow to-yellow-400 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <h3 className="text-4xl font-bold text-mdla-black mb-6">
                        Rejoignez MDLA
                    </h3>
                    <p className="text-lg text-mdla-black/80 mb-8">
                        Créez votre compte et accédez à tous nos services
                    </p>
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-mdla-black rounded-full flex items-center justify-center">
                                <span className="text-mdla-yellow font-bold">1</span>
                            </div>
                            <p className="text-mdla-black">Inscription rapide et gratuite</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-mdla-black rounded-full flex items-center justify-center">
                                <span className="text-mdla-yellow font-bold">2</span>
                            </div>
                            <p className="text-mdla-black">Accès à tous nos services</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-mdla-black rounded-full flex items-center justify-center">
                                <span className="text-mdla-yellow font-bold">3</span>
                            </div>
                            <p className="text-mdla-black">Support personnalisé</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-md w-full">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-block bg-mdla-yellow rounded-lg p-4 mb-4">
                            <UserPlus className="w-12 h-12 text-mdla-black" />
                        </div>
                        <h2 className="text-3xl font-bold text-mdla-black">
                            Inscription
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Créez votre compte MDLA
                        </p>
                    </div>

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{errors.general}</p>
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prénom *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all`}
                                        placeholder="Jean"
                                    />
                                </div>
                                {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all`}
                                    placeholder="Dupont"
                                />
                                {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all`}
                                    placeholder="votre@email.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Téléphone *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all`}
                                    placeholder="+226 XX XX XX XX"
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mot de passe *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all`}
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
                            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirmer le mot de passe *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-mdla-yellow focus:border-transparent outline-none transition-all`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Terms & Conditions */}
                        <div>
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className={`w-4 h-4 mt-1 text-mdla-yellow border-gray-300 rounded focus:ring-mdla-yellow ${errors.acceptTerms ? 'border-red-500' : ''}`}
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    J'accepte les{' '}
                                    <a href="#" className="text-mdla-yellow hover:text-yellow-600 font-semibold">
                                        conditions générales d'utilisation
                                    </a>
                                </span>
                            </label>
                            {errors.acceptTerms && <p className="text-xs text-red-600 mt-1">{errors.acceptTerms}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-mdla-yellow text-mdla-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Inscription...' : 'S\'inscrire'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-gray-600">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="text-mdla-yellow hover:text-yellow-600 font-semibold">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
