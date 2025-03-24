/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
// import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import Web3 from "web3";

// Define types
interface IAuthContext {
  isAuthenticated: boolean;
  user: any | null;
  web3Auth: Web3Auth | null;
  provider: IProvider | null;
  web3: Web3 | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  userRole: string | null;
  setUserRole: (role: string) => void;
  isRegistrationComplete: boolean;
}

// Create context with default values
const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  user: null,
  web3Auth: null,
  provider: null,
  web3: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
  userRole: null,
  setUserRole: () => {},
  isRegistrationComplete: false,
});

// Web3Auth client ID - This should be obtained from Web3Auth dashboard
const clientId =
  "BDMr0c3q7Qg-sLlY56qQDvXFPzTydOSJqkZE5EpzSTHLLXSUfPtxK5LIuUi3OOrmi-gY0pL8p2Ams69N_eagSNA"; // Replace with your actual client ID when registering

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Web3Auth
        // const privateKeyProvider = new EthereumPrivateKeyProvider({
        //   config: { chainConfig: {
        //       chainId: "0x1",
        //       rpcTarget: 'https://rpc.ankr.com/eth',
        //       displayName: '',
        //       blockExplorer: '',
        //       ticker: '',
        //       tickerName: ''
        //   } }
        // });

        const web3AuthInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1", // Ethereum mainnet
            rpcTarget: "https://rpc.ankr.com/eth", // Public RPC endpoint
          },
          uiConfig: {
            loginMethodsOrder: ["google", "email_passwordless"],
          },
        });

        setWeb3Auth(web3AuthInstance);

        await web3AuthInstance.initModal();

        // Check if user is already logged in
        if (web3AuthInstance.provider) {
          setProvider(web3AuthInstance.provider);
          const user = await web3AuthInstance.getUserInfo();
          setUser(user);
          const web3Instance = new Web3(web3AuthInstance.provider as any);
          setWeb3(web3Instance);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3Auth) {
      console.error("Web3Auth not initialized");
      return;
    }

    try {
      const provider = await web3Auth.connect();
      setProvider(provider);

      if (provider) {
        const user = await web3Auth.getUserInfo();
        setUser(user);
        const web3Instance = new Web3(provider as any);
        setWeb3(web3Instance);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = async () => {
    if (!web3Auth) {
      console.error("Web3Auth not initialized");
      return;
    }

    try {
      await web3Auth.logout();
      setProvider(null);
      setUser(null);
      setWeb3(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        web3Auth,
        provider,
        web3,
        login,
        logout,
        isLoading,
        userRole,
        setUserRole,
        isRegistrationComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
