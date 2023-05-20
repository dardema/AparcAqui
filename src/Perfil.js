import React, { useState } from "react";
import { View, Text, Image, Modal, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Perfil = ({userInfo, setUserInfo}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@user");
    setUserInfo(null);
  }

  return (
    <View style={styles.container}>
      {userInfo?.picture && (
        <Image source={{ uri: userInfo?.picture }} style={styles.image} />
      )}
      <Text style={styles.name}>{userInfo?.name}</Text>

      <View style={styles.options}>
        <Option icon="bell-outline" title="Notificaciones" />
        <Option icon="help-circle-outline" title="Ayuda" />
        <Option icon="information-outline" title="Mi información" onPress={() => setModalVisible(true)} />
        <Option icon="logout" title="Cerrar sesión" onPress={handleLogout} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalView}>
          {userInfo?.picture && (
            <Image source={{ uri: userInfo?.picture }} style={styles.image} />
          )}
          <Text style={styles.email}>Email: {userInfo?.email}</Text>
          <Text style={styles.email}>
            Verified: {userInfo?.verified_email ? "yes" : "no"}
          </Text>
          <Text style={styles.email}>Name: {userInfo?.name}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const Option = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={24} color="black" />
    <Text style={styles.optionText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  options: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 35,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default Perfil;