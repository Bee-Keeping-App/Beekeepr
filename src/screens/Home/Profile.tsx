import { Text } from "@react-navigation/elements";
import { StaticScreenProps } from "@react-navigation/native";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { useContext } from "react";
import { AccountContext } from "../../Contexts/AuthContext"; // adjust path if different

type Props = StaticScreenProps<{
  user: string;
}>;

export function Profile({ route }: Props) {
  const accountCtx = useContext(AccountContext);

  const handleLogout = () => {
    if (accountCtx?.logout) {
      accountCtx.logout();
    }
  };

  return (
    <View style={styles.container}>
      <Text> Profile</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "crimson",
    borderRadius: 10,
  },

  logoutText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
