// Account object just a temporary context to whole v

export interface Account {
  id: string;
  username: string;
  zipcode: string;
  accountLevel: number;
}

//JSON OBJ for reading

export interface LocalAccountData {}

export interface AccountContextType {
  accounts: Account[];
  currentAccount: Account | null;
  saveAccount: (account: Account) => Promise<void> | void;
  updateAccount: (
    id: string,
    zipcode: string,
    accountLevel: number
  ) => Promise<void> | void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void> | void;
  JSONlogin: () => void;
  guestLogin: () => Promise<void> | void;
}
