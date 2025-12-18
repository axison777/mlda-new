import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Demo accounts for testing
const DEMO_ACCOUNTS = [
    {
        id: 1,
        email: 'client@mdla.bf',
        password: 'demo123',
        role: 'client',
        name: 'Jean Dupont',
        phone: '+226 70 12 34 56'
    },
    {
        id: 2,
        email: 'admin@mdla.bf',
        password: 'admin123',
        role: 'admin',
        name: 'Admin MDLA',
        phone: '+226 25 36 29 52'
    },
    {
        id: 3,
        email: 'etudiant@mdla.bf',
        password: 'demo123',
        role: 'student',
        name: 'Marie Kaboré',
        phone: '+226 70 98 76 54'
    },
    {
        id: 4,
        email: 'prof@mdla.bf',
        password: 'demo123',
        role: 'prof',
        name: 'Prof. Schmidt',
        phone: '+226 70 11 22 33'
    },
    {
        id: 5,
        email: 'transit@mdla.bf',
        password: 'demo123',
        role: 'transit',
        name: 'Amadou Traoré',
        phone: '+226 70 44 55 66'
    }
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on init
    useEffect(() => {
        const savedUser = localStorage.getItem('mdla-user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('mdla-user');
            }
        }
        setIsLoading(false);
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('mdla-user', JSON.stringify(user));
        } else {
            localStorage.removeItem('mdla-user');
        }
    }, [user]);

    const login = async (email, password) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check demo accounts
        const account = DEMO_ACCOUNTS.find(
            acc => acc.email === email && acc.password === password
        );

        if (account) {
            const { password: _, ...userWithoutPassword } = account;
            setUser(userWithoutPassword);
            return { success: true, user: userWithoutPassword };
        }

        // Check if it's a new signup (stored in localStorage)
        const signupUsers = JSON.parse(localStorage.getItem('mdla-signup-users') || '[]');
        const signupUser = signupUsers.find(
            u => u.email === email && u.password === password
        );

        if (signupUser) {
            const { password: _, ...userWithoutPassword } = signupUser;
            setUser(userWithoutPassword);
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Email ou mot de passe incorrect' };
    };

    const signup = async (userData) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const { email, password, firstName, lastName, phone } = userData;

        // Check if email already exists
        const emailExists = DEMO_ACCOUNTS.some(acc => acc.email === email);
        const signupUsers = JSON.parse(localStorage.getItem('mdla-signup-users') || '[]');
        const emailExistsInSignup = signupUsers.some(u => u.email === email);

        if (emailExists || emailExistsInSignup) {
            return { success: false, error: 'Cet email est déjà utilisé' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            email,
            password,
            role: 'client',
            name: `${firstName} ${lastName}`,
            phone
        };

        // Save to localStorage
        signupUsers.push(newUser);
        localStorage.setItem('mdla-signup-users', JSON.stringify(signupUsers));

        // Auto-login
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);

        return { success: true, user: userWithoutPassword };
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        demoAccounts: DEMO_ACCOUNTS.map(({ password, ...acc }) => acc)
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
