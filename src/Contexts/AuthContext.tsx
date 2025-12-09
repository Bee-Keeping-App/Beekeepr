import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Account, AccountContextType } from "../@types/account";
import { API_BASE_URL } from "@env";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const AccountContext = createContext<AccountContextType | null>(null);

const STORAGE_KEY = "app_accounts_store";

type AccountProviderProps = {
  children: ReactNode;
};

const AccountProvider = ({ children }: AccountProviderProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const saveSecureData = async (
    updatedAccounts: Account[],
    updatedId: string | null
  ) => {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEY,
        JSON.stringify({
          accounts: updatedAccounts,
          currentAccountId: updatedId,
        })
      );
    } catch (err) {
      console.error("Failed to save to SecureStore:", err);
    }
  };

  const loadSecureData = async () => {
    try {
      const json = await SecureStore.getItemAsync(STORAGE_KEY);
      if (!json) return { accounts: [], currentAccountId: null };

      const data = JSON.parse(json);
      return {
        accounts: (data.accounts || []) as Account[],
        currentAccountId: (data.currentAccountId || null) as string | null,
      };
    } catch (err) {
      console.error("Failed to load SecureStore:", err);
      return { accounts: [], currentAccountId: null };
    }
  };

  // init load + refresh once
  useEffect(() => {
    const init = async () => {
      const stored = await loadSecureData();
      setAccounts(stored.accounts);
      setCurrentAccountId(stored.currentAccountId);

      await refreshAccessToken().catch(() => {});
    };
    init();
  }, []);

  const currentAccount = useMemo(
    () =>
      currentAccountId
        ? accounts.find((a) => a.id === currentAccountId) || null
        : null,
    [accounts, currentAccountId]
  );

  const saveAccount = useCallback(
    async (account: Account) => {
      setAccounts((prev) => {
        const exists = prev.some((a) => a.id === account.id);
        const updated = exists
          ? prev.map((a) => (a.id === account.id ? account : a))
          : [...prev, account];

        // persist using fresh updated array
        saveSecureData(updated, currentAccountId);
        return updated;
      });
    },
    [currentAccountId]
  );

  const updateAccount = useCallback(
    async (id: string, zipcode: string, accountLevel: number) => {
      setAccounts((prev) => {
        const updated = prev.map((a) =>
          a.id === id ? { ...a, zipcode, accountLevel } : a
        );
        saveSecureData(updated, currentAccountId);
        return updated;
      });
    },
    [currentAccountId]
  );

  const register = async (username: string, password: string) => {
    const res = await api.post("/register", { username, password });
    const { accessToken } = res.data;
    setAccessToken(accessToken);

    const newAcc: Account = {
      id: username,
      username,
      zipcode: "",
      accountLevel: 0,
    };

    setAccounts((prev) => {
      const updated = [...prev, newAcc];
      setCurrentAccountId(username);
      saveSecureData(updated, username);
      return updated;
    });
  };

  const login = async (username: string, password: string) => {
    const res = await api.post("/login", { username, password });
    const { accessToken } = res.data;
    setAccessToken(accessToken);

    setAccounts((prev) => {
      const existing =
        prev.find((a) => a.username === username) ||
        ({
          id: username,
          username,
          zipcode: "",
          accountLevel: 0,
        } as Account);

      const updated = prev.some((a) => a.id === existing.id)
        ? prev.map((a) => (a.id === existing.id ? existing : a))
        : [...prev, existing];

      setCurrentAccountId(existing.id);
      saveSecureData(updated, existing.id);
      return updated;
    });
  };

  const guestLogin = async () => {
    const guestAcc: Account = {
      id: "guest",
      username: "Guest",
      zipcode: "",
      accountLevel: 0,
    };

    setAccounts((prev) => {
      const exists = prev.some((a) => a.id === guestAcc.id);
      const updated = exists ? prev : [...prev, guestAcc];

      setCurrentAccountId(guestAcc.id);
      saveSecureData(updated, guestAcc.id);
      return updated;
    });

    // No real token for guest
    setAccessToken(null);
  };

  const refreshAccessToken = async () => {
    try {
      const res = await api.get("/refresh");
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch {
      console.log("Refresh failed.");
      setAccessToken(null);
      return null;
    }
  };

  const logout = async () => {
    setCurrentAccountId(null);
    setAccessToken(null);
    await saveSecureData(accounts, null);
  };

  const value: AccountContextType = {
    accounts,
    currentAccount,
    saveAccount,
    updateAccount,
    login,
    logout,
    JSONlogin: () => {},
    guestLogin,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export default AccountProvider;
