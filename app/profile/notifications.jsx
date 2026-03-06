import { View, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function Notifications() {
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  const options = [
    { label: "Push Notifications", value: pushNotif, setter: setPushNotif },
    { label: "Email Notifications", value: emailNotif, setter: setEmailNotif },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb] px-6 pt-6">
      <Text className="text-xl font-bold text-gray-800 mb-6">Notifications</Text>

      {options.map((opt, i) => (
        <View
          key={i}
          className="flex-row justify-between items-center bg-white p-4 rounded-2xl mb-4 shadow"
        >
          <Text className="text-gray-800 font-semibold">{opt.label}</Text>
          <Switch
            value={opt.value}
            onValueChange={opt.setter}
            trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
            thumbColor="#ffffff"
          />
        </View>
      ))}
    </SafeAreaView>
  );
}
