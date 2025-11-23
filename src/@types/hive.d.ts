// object to hold Queen Info
interface QueenInfo {
  QueenParent: string; //here store if start of line
  QueenName: string;
  sourceObtained: string;
  ageBirth: string;
  hygenicBehavior: string;
  broodPattern: string;
  agressiveness: string;
}

interface ColonyNode {
  activeStatus: boolean;
  Queen: QueenInfo;
  value: ColonyInfo;
  children?: ColonyNode<ColonyInfo>[];
}

const;

//export tree of colonies through reading through json obj
