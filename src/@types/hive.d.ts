// object to hold Qualitive Queen Info
export interface QueenInfo {
  QueenParent: string; // here store "start" if start of line
  QueenName: string;
  sourceObtained: string;
  age: string;
  hygenicBehavior: string;
  broodPattern: string;
  agressiveness: string;
}

// Tree Node
export interface ColonyNode<TQueen = QueenInfo> {
  activeStatus: boolean;
  Queen: TQueen;
  children?: ColonyNode<TQueen>[];
}

// One lineage
export type ColonyTree = ColonyNode<QueenInfo>;

// multiple lineages
export type ColonyForest = ColonyNode<QueenInfo>[];
