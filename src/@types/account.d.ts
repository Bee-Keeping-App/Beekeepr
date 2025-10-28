// Account object just a temporary context to whole v

export interface Account {

    id: number;
    username: string;
    zipcode: string;
    accountLevel: number;

}
export type AccountContextType = {
    accounts: Account[];
    saveAccount: (account: Account) => void;
    updateAccount: (id: number, zipcode: string, accountLevel: number) => void;
  };
  