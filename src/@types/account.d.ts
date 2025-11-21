// Account object just a temporary context to whole v

export interface Account {
  id: string;
  username: string;
  zipcode: string;
  accountLevel: number;
}

//JSON OBJ for reading

export interface LocalAccountData {}

export type AccountContextType = {
  accounts: Account[];
  currentAccount: Account | null;
  saveAccount: (account: Account) => void;
  updateAccount: (id: string, zipcode: string, accountLevel: number) => void;
  login: (username: string, password: string) => void;
  JSONlogin: (id: string) => void;
  logout: () => void;
};
