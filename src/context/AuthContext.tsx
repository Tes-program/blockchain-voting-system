/* eslint-disable @typescript-eslint/no-explicit-any */
// Updated src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import Web3 from "web3";
import { getCurrentUser, verifyWeb3Auth, registerUser } from '../services/authService';

// Define interfaces for TypeScript
interface IUser {
  _id?: string;
  email?: string;
  name?: string;
  walletAddress?: string;
  role?: string;
  isVerified?: boolean;
  profileData?: any;
}

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  web3Auth: Web3Auth | null;
  provider: IProvider | null;
  web3: Web3 | null;
  isLoading: boolean;
  error: string | null;
  userRole: string | null;
  setUserRole: (role: string) => void;
  isRegistrationComplete: boolean;
  login: () => Promise<any>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<any>;
  needsRegistration: boolean;
}

// Create context with default values
const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  user: null,
  web3Auth: null,
  provider: null,
  web3: null,
  isLoading: true,
  error: null,
  userRole: null,
  setUserRole: () => {},
  isRegistrationComplete: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  needsRegistration: false,
});

// Client ID from environment variables
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || 
  "BDMr0c3q7Qg-sLlY56qQDvXFPzTydOSJqkZE5EpzSTHLLXSUfPtxK5LIuUi3OOrmi-gY0pL8p2Ams69N_eagSNA";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Web3Auth
        // const privateKeyProvider = new EthereumPrivateKeyProvider({
        //   config: { 
        //     chainConfig: {
        //       chainNamespace: CHAIN_NAMESPACES.EIP155,
        //       chainId: "0x1", // Ethereum mainnet
        //       rpcTarget: "https://rpc.ankr.com/eth",
        //       displayName: "Ethereum Mainnet",
        //       blockExplorer: "https://etherscan.io",
        //       ticker: "ETH",
        //       tickerName: "Ethereum"
        //     } 
        //   }
        // });

        const web3AuthInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1", // Ethereum mainnet
            rpcTarget: "https://rpc.ankr.com/eth/1c017288ef604627aeee6518d880971fbfecbe4f7ae2c95961dd55ec0ac0b668", // Public RPC endpoint
          },
          uiConfig: {
            loginMethodsOrder: ["google", "email_passwordless"],
          },
        });

        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();

        // Check if token exists and verify it
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data);
              setIsAuthenticated(true);
              setUserRole(response.data.role);
              setIsRegistrationComplete(true);
              setNeedsRegistration(false);
              
              // Also set up web3 if we have the provider
              if (web3AuthInstance.provider) {
                setProvider(web3AuthInstance.provider);
                const web3Instance = new Web3(web3AuthInstance.provider as any);
                setWeb3(web3Instance);
              }
            }
          } catch (err) {
            console.error("Token verification failed:", err);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
        setError("Failed to initialize authentication system");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3Auth) {
      setError("Web3Auth not initialized");
      return { success: false, error: "Web3Auth not initialized" };
    }

    try {
      setIsLoading(true);
      const web3authProvider = await web3Auth.connect();
      setProvider(web3authProvider);
      
      if (web3authProvider) {
        const userInfo = await web3Auth.getUserInfo();
        
        // Set up web3 instance
        const web3Instance = new Web3(web3authProvider as any);
        setWeb3(web3Instance);
        
        // Get Ethereum address
        const accounts = await web3Instance.eth.getAccounts();
        const walletAddress = accounts[0];
        
        // Store basic user data
        const basicUserData = {
          email: userInfo.email,
          name: userInfo.name,
          walletAddress: walletAddress
        };
        
        setUser(basicUserData);
        
        // Try to verify with backend
        try {
          const response = await verifyWeb3Auth(walletAddress);
          
          if (response.success) {
            // User exists in database, set authenticated
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setIsAuthenticated(true);
            setUserRole(response.data.role);
            setIsRegistrationComplete(true);
            setNeedsRegistration(false);
            return { success: true, userExists: true, role: response.data.role };
          } else {
            // User needs to register
            setIsAuthenticated(false);
            setNeedsRegistration(true);
            setIsRegistrationComplete(false);
            return { 
              success: true, 
              userExists: false, 
              needsRegistration: true,
              userData: basicUserData
            };
          }
        } catch (err) {
          console.error("Verification failed:", err);
          // User likely needs to register
          setIsAuthenticated(false);
          setNeedsRegistration(true);
          setIsRegistrationComplete(false);
          return { 
            success: true, 
            userExists: false, 
            needsRegistration: true,
            userData: basicUserData
          };
        }
      }
      
      return { success: false, error: "Failed to connect wallet" };
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await registerUser(userData);
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setUserRole(response.data.user.role);
        setIsRegistrationComplete(true);
        setNeedsRegistration(false);
        return { success: true, role: response.data.role };
      } else {
        return { success: false, message: response.message || "Registration failed" };
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
      return { success: false, message: error.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!web3Auth) {
      console.error("Web3Auth not initialized");
      return;
    }

    try {
      await web3Auth.logout();
      localStorage.removeItem('token');
      setProvider(null);
      setUser(null);
      setWeb3(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setIsRegistrationComplete(false);
      setNeedsRegistration(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        web3Auth,
        provider,
        web3,
        isLoading,
        error,
        userRole,
        setUserRole,
        isRegistrationComplete,
        login,
        logout,
        register,
        needsRegistration
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);