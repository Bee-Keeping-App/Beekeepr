import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text } from "@react-navigation/elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HiveTrackerStackParamList } from "../../navigation/stacks/HiveTrackerStack";
import { useHive } from "../../Contexts/HiveContext";
import { QueenInfo } from "../../@types/hive";

type HiveDetailsProps = NativeStackScreenProps<
  HiveTrackerStackParamList,
  "HiveDetails"
>;

export function HiveDetails({ route }: HiveDetailsProps) {
  const { user } = route.params;
  const { addHive, removeHiveByQueenName } = useHive();

  const [queenName, setQueenName] = useState("");
  const [queenParent, setQueenParent] = useState("start");
  const [sourceObtained, setSourceObtained] = useState("");
  const [age, setAge] = useState("");
  const [hygenicBehavior, setHygenicBehavior] = useState("");
  const [broodPattern, setBroodPattern] = useState("");
  const [agressiveness, setAgressiveness] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const handleAddQueen = () => {
    if (!queenName.trim()) {
      alert("Please enter a queen name.");
      return;
    }

    const newQueen: QueenInfo = {
      QueenParent: queenParent || "start",
      QueenName: queenName.trim(),
      sourceObtained: sourceObtained.trim(),
      age: age.trim(),
      hygenicBehavior: hygenicBehavior.trim(),
      broodPattern: broodPattern.trim(),
      agressiveness: agressiveness.trim(),
    };

    addHive(newQueen);
    alert(`Queen "${newQueen.QueenName}" added.`);

    setQueenName("");
    setSourceObtained("");
    setAge("");
    setHygenicBehavior("");
    setBroodPattern("");
    setAgressiveness("");
  };

  const handleDeleteQueen = () => {
    if (!deleteName.trim()) {
      alert("Enter a queen name to delete.");
      return;
    }
    removeHiveByQueenName(deleteName.trim());
    alert(`Attempted to remove queen "${deleteName.trim()}"`);
    setDeleteName("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Hive Details</Text>
      <Text>User: {user}</Text>

      <Text style={styles.sectionTitle}>Add / Create Queen</Text>

      {/* Labels to make it easier to read */}
      <Text style={styles.label}>Queen Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Queen Name"
        value={queenName}
        onChangeText={setQueenName}
      />

      <Text style={styles.label}>Parent Queen (or "start" for root)</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g. "start" or QueenName'
        value={queenParent}
        onChangeText={setQueenParent}
      />

      <Text style={styles.label}>Source Obtained</Text>
      <TextInput
        style={styles.input}
        placeholder="Source Obtained"
        value={sourceObtained}
        onChangeText={setSourceObtained}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Hygienic Behavior</Text>
      <TextInput
        style={styles.input}
        placeholder="Hygienic Behavior"
        value={hygenicBehavior}
        onChangeText={setHygenicBehavior}
      />

      <Text style={styles.label}>Brood Pattern</Text>
      <TextInput
        style={styles.input}
        placeholder="Brood Pattern"
        value={broodPattern}
        onChangeText={setBroodPattern}
      />

      <Text style={styles.label}>Aggressiveness</Text>
      <TextInput
        style={styles.input}
        placeholder="Aggressiveness"
        value={agressiveness}
        onChangeText={setAgressiveness}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleAddQueen}>
        <Text style={styles.buttonText}>Add / Attach Queen</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />

      <Text style={styles.sectionTitle}>Delete Queen</Text>

      <Text style={styles.label}>Queen Name to Delete</Text>
      <TextInput
        style={styles.input}
        placeholder="Queen Name"
        value={deleteName}
        onChangeText={setDeleteName}
      />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteQueen}>
        <Text style={styles.buttonText}>Delete Queen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: -4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "white",
    color: "black",
  },
  primaryButton: {
    backgroundColor: "darkorange",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "crimson",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});
