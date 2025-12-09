import React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HiveTrackerStackParamList } from "../../navigation/stacks/HiveTrackerStack";
import { useHive } from "../../Contexts/HiveContext";
import { ColonyNode, QueenInfo } from "../../@types/hive";

type HiveTrackerProps = NativeStackScreenProps<
  HiveTrackerStackParamList,
  "HiveTracker"
>;

export function HiveTracker({ navigation }: HiveTrackerProps) {
  const { forest } = useHive();

  const goToDetails = () => {
    navigation.navigate("HiveDetails", { user: "HiveKeeper" });
  };

  const renderNode = (node: ColonyNode<QueenInfo>, depth: number = 0) => {
    const indent = depth * 16;

    return (
      <View key={node.Queen.QueenName}>
        <View style={[styles.nodeRow, { marginLeft: indent }]}>
          <View style={styles.nodeBullet} />
          <View>
            <Text style={styles.nodeTitle}>{node.Queen.QueenName}</Text>
            <Text style={styles.nodeSubtitle}>
              Parent: {node.Queen.QueenParent} | Age: {node.Queen.age}
            </Text>
          </View>
        </View>

        {node.children &&
          node.children.map((child) => renderNode(child, depth + 1))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hive Tracker</Text>

      <TouchableOpacity style={styles.detailsButton} onPress={goToDetails}>
        <Text style={styles.detailsButtonText}>Go to Hive Details</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Queens & Lineage</Text>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {forest.length === 0 ? (
          <Text style={styles.emptyText}>
            No queens yet. Add some in Hive Details.
          </Text>
        ) : (
          forest.map((root) => renderNode(root, 0))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  detailsButton: {
    alignSelf: "center",
    backgroundColor: "darkorange",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  detailsButtonText: {
    color: "white",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  listContainer: {
    paddingVertical: 8,
    gap: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  nodeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  nodeBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "darkorange",
    marginRight: 8,
  },
  nodeTitle: {
    fontWeight: "600",
  },
  nodeSubtitle: {
    fontSize: 12,
    color: "#555",
  },
});
