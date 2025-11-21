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

const BASE_URL = API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
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

  //  SecureStore helpers
  const loadSecureData = async () => {
    try {
      const json = await SecureStore.getItemAsync(STORAGE_KEY);
      if (json) {
        const data = JSON.parse(json);
        setAccounts(data.accounts || []);
        setCurrentAccountId(data.currentAccountId || null);
      }
    } catch (err) {
      console.error("Failed to load SecureStore:", err);
    }
  };

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

  const clearSecureData = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear SecureStore:", err);
    }
  };

  /* load stored accounts + attempt refresh on startup */
  useEffect(() => {
    const init = async () => {
      await loadSecureData();
      // Attempt refresh token on startup
      await refreshAccessToken().catch(() => {});
    };
    init();
  }, []);

  /* currently active account using memo */
  const currentAccount = useMemo(
    () =>
      currentAccountId
        ? accounts.find((a) => a.id === currentAccountId) || null
        : null,
    [accounts, currentAccountId]
  );

  /* save/update account */

  const saveAccount = useCallback(
    async (account: Account) => {
      setAccounts((prev) => {
        const exists = prev.some((a) => a.id === account.id);
        const updated = exists
          ? prev.map((a) => (a.id === account.id ? account : a))
          : [...prev, account];

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

  /* REGISTER */
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

    setCurrentAccountId(username);
    await saveAccount(newAcc);

    // ensure persisted state reflects new account + selected id
    await saveSecureData([...accounts, newAcc], username);
  };

  /* login */
  const login = async (username: string, password: string) => {
    const res = await api.post("/login", { username, password });
    const { accessToken } = res.data;
    setAccessToken(accessToken);

    const account: Account =
      accounts.find((a) => a.username === username) ||
      ({
        id: username,
        username,
        zipcode: "",
        accountLevel: 0,
      } as Account);

    // persist if first time
    await saveAccount(account);

    setCurrentAccountId(account.id);
    await saveSecureData(accounts, account.id);
  };

  /* refresh token (do after every login from storage) */
  const refreshAccessToken = async () => {
    try {
      const res = await api.get("/refresh");
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch (err) {
      console.log("Refresh failed.");
      setAccessToken(null);
      return null;
    }
  };

  /* logout */
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
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export default AccountProvider;
