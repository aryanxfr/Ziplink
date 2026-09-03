import { createContext, useCallback, useEffect, useMemo,useState } from "react";
import authService from "../services/auth.service";
import { registerLogoutHandler, unregisterLogoutHandler } from "../services/authManager";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export const AuthContext= createContext(null);

export function AuthProvider({children}) {
    const[user,setUser]=useState(null);
    const[loading,setLoading]=useState(true);
    const navigate = useNavigate();

    const forceLogout = useCallback(async () => {
        try{
            await authService.logout();
        } catch{
            // Ignore logout API failures
        } finally {
            setUser(null)
            navigate(ROUTES.SESSION_EXPIRED, {replace : true});
        }
    }, [navigate]);

    useEffect(()=>{
        registerLogoutHandler(forceLogout);

        return () => unregisterLogoutHandler();
    }, [forceLogout]);

    const checkAuth= useCallback(async () => {
        try{
            const response= await authService.getCurrentUser();
            setUser(response);
        } catch(error){
            if(error.response?.status===401){
                setUser(null);
            }else{
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        checkAuth();
    },[checkAuth]);

    const login = async(credentials)=>{
        await authService.login(credentials);
        const response= await authService.getCurrentUser();
        setUser(response);
    };

    const logout=async () => {
        await forceLogout();
    };

    const value=useMemo(
        ()=>({
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout,
            checkAuth
        }),
        [user,loading,checkAuth]
    );

return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
);
}