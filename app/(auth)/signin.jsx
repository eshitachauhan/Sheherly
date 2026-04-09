import { useRouter } from "expo-router";
import { Formik } from 'formik';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from 'react-native';
import { Alert } from 'react-native';
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import validationSchema from '../../utils/authSchema';
const logo = require("../../assets/images/sheherlyTitle.png")

const BASE_URL = "http://10.224.117.139:5000"; 

const Signin = () => {
  const router = useRouter();
  
  const handleSignin = async (values) => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    console.log("FULL RESPONSE:", data); 

    if (!res.ok) {
      Alert.alert("Signin Failed", data.message || "Invalid credentials");
      return;
    }

    await AsyncStorage.setItem("token", data.token);
    await SecureStore.setItemAsync("token", data.token);

    if (data.user) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/home");
      }
    } else {
      router.replace("/home");
    }

  } catch (err) {
    console.log("SIGNIN ERROR:", err);
    Alert.alert("Error", "Server not reachable");
  }
};

  return (
    <SafeAreaView className={`bg-[white]`}>
      <ScrollView contentContainerStyle={{ height : "100%" }}>
        <View className="m-2 flex justify-center items-center">
          
          <Image source={logo} style={{ width : 300, height : 220 }}/>
        
        <View className="w-5/6">
          
          <Formik initialValues={{email:"",password:""}} validationSchema={validationSchema} onSubmit={handleSignin}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched
            }) => (
              <View className="w-full">
                
                <Text className="text-[#218fb4ff] mt-4 mb-2">Email</Text>
                <TextInput 
                  className="h-10 border border-[#218fb4ff] bg-white text-[#9fd5efff] rounded px-2"
                  keyboardType="email-address" 
                  onChangeText={handleChange("email")} 
                  value={values.email} 
                  onBlur={handleBlur("email")}
                />
                {touched.email && errors.email && (
                  <Text className="text-red-500 text=xs mb-2">
                    {errors.email}
                  </Text>
                )}

                <Text className="text-[#218fb4ff] mt-4 mb-2">Password</Text>
                <TextInput 
                  className="h-10 border border-[#218fb4ff] bg-white text-[#9fd5efff] rounded px-2"
                  secureTextEntry
                  onChangeText={handleChange("password")} 
                  value={values.password} 
                  onBlur={handleBlur("password")}
                />
                {touched.password && errors.password && (
                  <Text className="text-red-500 text=xs mb-2">
                    {errors.password}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={handleSubmit}
                  className="p-2 mt-6 my-2 bg-[#218fb4ff] rounded-lg"
                >
                  <Text className="text-lg text-white font-semibold text-center">
                    Sign In
                  </Text>
                </TouchableOpacity>
              
              </View>
            )}
          </Formik>           
          <View>
            <TouchableOpacity 
              className="my-5 p-2 flex flex-row justify-center items-center" 
              onPress={()=>router.push("/signup")}
            >
              <Text className="font-semibold">New User?</Text>
              <Text className="text-base font-semibold text-center text-[#218fb4ff]">  Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>

        <StatusBar barStyle={"light-content"} backgroundColor={"grey"} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signin