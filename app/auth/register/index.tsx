import apis from "@/utils/apis";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const onSubmit = () => {
    if (
      form.email.trim() === "" ||
      form.username.trim() === "" ||
      form.password.trim() === "" ||
      form.password.trim().length < 6
    ) {
      return alert("Register: " + " All fields are required! Your password must be least 6 character!");
    }

    apis
      .register(form.username, form.email, form.password)
      .then(res => {
        alert("Register: " + "Register successfully!");
        localStorage.setItem(
          "etwl",
          JSON.stringify({
            id: res.data.user.id,
            username: res.data.user.username,
            email: res.data.user.email,
            token: res.data.jwt,
          })
        );
        router.push("/");
      })
      .catch(err => {
        alert("Register: " + err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.form}>
        <View style={{ gap: 8 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={styles.inputTitle}>Username</Text>
            <Text style={styles.inputRequireDot}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={username => setForm({ ...form, username })}
          />
        </View>
        <View style={{ gap: 8 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={styles.inputTitle}>Email</Text>
            <Text style={styles.inputRequireDot}>*</Text>
          </View>
          <TextInput style={styles.input} value={form.email} onChangeText={email => setForm({ ...form, email })} />
        </View>
        <View style={{ gap: 8 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text style={styles.inputTitle}>Password</Text>
            <Text style={styles.inputRequireDot}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={password => setForm({ ...form, password })}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonContent}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Link href={"/auth/login"} style={{ textAlign: "center" }}>
        <Text style={{}}>Have an account? Login here</Text>
      </Link>
    </View>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
  },
  input: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 10,
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  inputRequireDot: {
    color: "red",
  },
  form: {
    display: "flex",
    gap: 16,
    padding: 16,
  },
  button: {
    backgroundColor: "green",
    borderWidth: 2,
    shadowColor: "blue",
    borderRadius: 8,
    padding: 8,
  },
  buttonContent: {
    color: "white",
    fontWeight: 700,
    textAlign: "center",
  },
});
