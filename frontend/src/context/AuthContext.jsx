import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const AUTH_URL = 'http://localhost:5000/api/auth';
const STORAGE_KEY = 'userInfo';

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			const storedUser = localStorage.getItem(STORAGE_KEY);
			if (storedUser) {
				const parsedUser = JSON.parse(storedUser);
				if (parsedUser?.token) {
					setUser(parsedUser);
				} else {
					localStorage.removeItem(STORAGE_KEY);
				}
			}
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		} finally {
			setLoading(false);
		}
	}, []);

	const authenticate = async (endpoint, credentials) => {
		try {
			const response = await fetch(`${AUTH_URL}/${endpoint}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials)
			});
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				return {
					success: false,
					message: data.message || 'Authentication failed. Please try again.'
				};
			}

			setUser(data);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			return { success: true };
		} catch {
			return {
				success: false,
				message: 'Unable to connect to the server. Please try again.'
			};
		}
	};

	const login = (email, password) =>
		authenticate('login', { email, password });

	const register = (name, email, password) =>
		authenticate('register', { name, email, password });

	const logout = () => {
		localStorage.removeItem(STORAGE_KEY);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
