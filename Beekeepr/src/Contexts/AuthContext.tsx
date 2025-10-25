import * as React from "react";
import { AccountContextType, Account } from "../@types/account";

export const AccountContext = React.createContext<AccountContextType | null>(null);

const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    //temp account info
  const [accounts, setAccounts] = React.useState<Account[]>([
    {
      id: 0,
      username: "BestBeekeepr",
      zipcode: "123423",
      accountLevel: 0,
    },
    {
      id: -1,
      username: "BeeWizard",
      zipcode: "128979",
      accountLevel: 1,
    },
  ]);


  //save info
  const saveAccount = (account: Account) => {
    setAccounts(prev => {
      const exists = prev.some(a => a.id === account.id); // boolean to test if account id exists
      return exists ? prev.map(a => (a.id === account.id ? account : a)) //update existing  
      : [...prev, account]; // add new info
    });
  };

  // update it
  const updateAccount = (id: number, zipcode: string, accountLevel: number) => {
    setAccounts(prev =>
      prev.map(a => (a.id === id ? { ...a, zipcode, accountLevel } : a))// return updated account in list
    );
  };

  const value: AccountContextType = {
    accounts,
    saveAccount,
    updateAccount,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export default AccountProvider;

