import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { QueenInfo, ColonyNode } from "../@types/hive";

export type ColonyForest = ColonyNode<QueenInfo>[];

//Context Type

export interface HiveContextType {
  forest: ColonyForest;
  addHive: (queen: QueenInfo) => void;
  removeHiveByQueenName: (queenName: string) => void;
  clearForest: () => void;
}

//helpers

// Add a node as a child to the node whose QueenName === parentName
function addChildToNode(
  node: ColonyNode<QueenInfo>,
  parentName: string,
  newNode: ColonyNode<QueenInfo>
): { node: ColonyNode<QueenInfo>; added: boolean } {
  // If this is the parent, attach the new child
  if (node.Queen.QueenName === parentName) {
    const children = node.children ? [...node.children, newNode] : [newNode];
    return { node: { ...node, children }, added: true };
  }

  // recurse into children if any
  if (!node.children || node.children.length === 0) {
    return { node, added: false };
  }

  let added = false;
  const updatedChildren = node.children.map((child) => {
    const res = addChildToNode(child, parentName, newNode);
    if (res.added) added = true;
    return res.node;
  });

  return { node: { ...node, children: updatedChildren }, added };
}

// Add a node somewhere within a forest
function addNodeToForest(
  forest: ColonyForest,
  parentName: string,
  newNode: ColonyNode<QueenInfo>
): { forest: ColonyForest; added: boolean } {
  let added = false;

  const updatedForest = forest.map((root) => {
    const res = addChildToNode(root, parentName, newNode);
    if (res.added) added = true;
    return res.node;
  });

  return { forest: added ? updatedForest : forest, added };
}

// Remove a node by queen name from a tree
function removeNodeFromTree(
  node: ColonyNode<QueenInfo>,
  queenName: string
): { node: ColonyNode<QueenInfo> | null; removed: boolean } {
  // If this is the node to remove, return null
  if (node.Queen.QueenName === queenName) {
    return { node: null, removed: true };
  }

  if (!node.children || node.children.length === 0) {
    return { node, removed: false };
  }

  let removed = false;
  const remainingChildren: ColonyNode<QueenInfo>[] = [];

  for (const child of node.children) {
    const res = removeNodeFromTree(child, queenName);
    if (res.removed) {
      removed = true;
    }
    if (res.node) {
      remainingChildren.push(res.node);
    }
  }

  return {
    node: { ...node, children: remainingChildren },
    removed,
  };
}

// Remove a node by queen name anywhere in the forest
function removeNodeFromForest(
  forest: ColonyForest,
  queenName: string
): { forest: ColonyForest; removed: boolean } {
  let removed = false;
  const newForest: ColonyForest = [];

  for (const root of forest) {
    const res = removeNodeFromTree(root, queenName);
    if (res.removed) {
      removed = true;
    }
    if (res.node) {
      newForest.push(res.node);
    }
  }

  return { forest: newForest, removed };
}

//Context & Provider

const HiveContext = createContext<HiveContextType | undefined>(undefined);

export const useHive = (): HiveContextType => {
  const ctx = useContext(HiveContext);
  if (!ctx) {
    throw new Error("useHive must be used within a HiveProvider");
  }
  return ctx;
};

interface HiveProviderProps {
  children: ReactNode;
  initialForest?: ColonyForest;
}

export const HiveProvider: React.FC<HiveProviderProps> = ({
  children,
  initialForest = [],
}) => {
  const [forest, setForest] = useState<ColonyForest>(initialForest);

  const addHive = useCallback((queen: QueenInfo) => {
    const newNode: ColonyNode<QueenInfo> = {
      activeStatus: true,
      Queen: queen,
      children: [],
    };

    // New root colony
    if (queen.QueenParent === "start") {
      setForest((prev) => [...prev, newNode]);
      return;
    }

    // Child colony: parent must exist by QueenName
    setForest((prev) => {
      const { forest: updated, added } = addNodeToForest(
        prev,
        queen.QueenParent,
        newNode
      );

      if (!added) {
        console.warn(
          `Parent queen "${queen.QueenParent}" not found in forest; child "${queen.QueenName}" was not added.`
        );
        return prev;
      }

      return updated;
    });
  }, []);

  // Remove by queen name (root or child)
  const removeHiveByQueenName = useCallback((queenName: string) => {
    setForest((prev) => {
      const { forest: updated, removed } = removeNodeFromForest(
        prev,
        queenName
      );
      if (!removed) {
        console.warn(`Queen "${queenName}" not found; no hives removed.`);
        return prev;
      }
      return updated;
    });
  }, []);

  const clearForest = useCallback(() => {
    setForest([]);
  }, []);

  const value: HiveContextType = useMemo(
    () => ({
      forest,
      addHive,
      removeHiveByQueenName,
      clearForest,
    }),
    [forest, addHive, removeHiveByQueenName, clearForest]
  );

  return <HiveContext.Provider value={value}>{children}</HiveContext.Provider>;
};
