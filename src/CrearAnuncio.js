import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image,TextInput, TouchableOpacity, FlatList, Modal } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

function CrearAnuncio() {
  
    const [coche, setCoche] = useState('');
    const [hora, setHora] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [tipoaparc, setTipoaparc] = useState('');
  
    const handleLocationPress = () => {
      // Aquí podrías implementar la lógica para obtener la ubicación del usuario
    };
  
    const handleSubmit = () => {
      
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Anuncio</Text>
        <View style={styles.separator} />
        <View style={styles.form}>
          <Text style={styles.label}>Tipo de coche:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={coche}
              onChangeText={setCoche}
              placeholder="Selecciona un tipo de coche"
            />
          </View>
          <Text style={styles.label}>Tiempo de salida:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={hora}
              onChangeText={setHora}
              placeholder="Selecciona un tiempo de llegada"
            />
          </View>
          <Text style={styles.label}>Tipo de aparcamiento:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={tipoaparc}
              onChangeText={setTipoaparc}
              placeholder="Selecciona tipo aparcamiento"
            />
          </View>
          <Text style={styles.label}>Ubicación actual:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={ubicacion}
              onChangeText={setUbicacion}
              placeholder="Introduce tu ubicación"
            />
            <TouchableOpacity onPress={handleLocationPress}>
              <MaterialCommunityIcons name="map-marker" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  export default CrearAnuncio;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
      backgroundColor: 'gray',
    },
    form: {
      marginTop: 20,
    },
    email: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
    },
    button: {
      backgroundColor: 'blue',
      borderRadius: 5,
      padding: 10,
      alignSelf: 'flex-end',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    card: {
      borderWidth: 1,
      borderRadius: 15,
      padding: 15,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 20,
    },
    map:{
      flex: 1,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    optionText: {
      fontSize: 16,
      marginLeft: 10,
    },
    // a partir de aquí es del perfil
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });