import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform, TextInput, Button, Modal, Alert } from "react-native";
import { RadioButton } from 'react-native-paper'; 
import { doc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker'; 
import RNPickerSelect from "react-native-picker-select"; 

import db from './firebase';

function CrearAnuncio(location) {

  const [tipocoche, setTipocoche] = useState('');
  const [horasalida, setHorasalida] = useState(new Date());
  const [horasalidaFormatted, setHorasalidaFormatted] = useState('');  // Nuevo estado para la fecha formateada
  const [tipoaparc, setTipoaparc] = useState('gratuito');
  const [reservado, setReservado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);  // Nuevo estado para el control del modal
  const [docId, setDocId] = useState('');  // Nuevo estado para guardar el ID del documento

  const handleSubmit = async () => {

    const anuncioData = {
      tipocoche: tipocoche,
      horasalida: horasalidaFormatted, // Usamos la fecha formateada
      tipoaparc: tipoaparc,
      reservado: reservado,
      longitude: location.location.coords.longitude,
      latitude: location.location.coords.latitude,
    };

    try {
      const aparcamientoRef = collection(db, 'aparcamiento');
      const docRef = await addDoc(aparcamientoRef, anuncioData);

      console.log("Datos guardados exitosamente");
      setDocId(docRef.id);  // Guardamos el ID del documento
      setModalVisible(true);  // Mostramos el modal
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const closeModal = async () => {
    // Actualizamos el documento y establecemos reservado a true
    //await updateDoc(doc(db, "aparcamiento", docId), {
      //reservado: true
    //});
    //Alert.alert("El cambio de coche en el aparcamiento ha sido confirmado.");
    setModalVisible(false);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setHorasalida(currentDate);  // Guardamos la fecha como objeto Date

    // Formateamos la fecha y la guardamos en el otro estado
    let day = ("0" + currentDate.getDate()).slice(-2);
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let year = currentDate.getFullYear();
    let hours = ("0" + currentDate.getHours()).slice(-2);
    let minutes = ("0" + currentDate.getMinutes()).slice(-2);

    let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    setHorasalidaFormatted(formattedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anuncio</Text>
      <View style={styles.separator} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Tamaño de coche: {tipocoche}</Text>
            <Text style={styles.modalText}>Hora de salida: {horasalidaFormatted}</Text>
            <Text style={styles.modalText}>Tipo de aparcamiento: {tipoaparc}</Text>
            <Button title="Cerrar y Confirmar" onPress={closeModal} />
          </View>
        </View>
      </Modal>

      <View style={styles.form}>
        
        <Text style={styles.label}>Tamaño de coche:</Text>
        <RNPickerSelect
          onValueChange={(value) => setTipocoche(value)}
          items={[
              { label: 'Pequeño', value: 'Pequeño' },
              { label: 'Mediano', value: 'Mediano' },
              { label: 'Grande', value: 'Grande' },
          ]}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selecciona el tamaño de coche...',
            value: null,
          }}
        />
         
        <Text style={styles.label}>Hora de salida:</Text>
        <View style={styles.inputContainer}>
          <DateTimePicker
              testID="dateTimePicker"
              value={horasalida}
              mode={'time'}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
         
        </View>
        
        <Text style={styles.label}>Tipo de aparcamiento:</Text>
        <RadioButton.Group onValueChange={newValue => setTipoaparc(newValue)} value={tipoaparc}>
          <View style={styles.inputContainer}>
            <View style={styles.radioButton}>
              <RadioButton value="gratuito" color="#00BCD4" />
              <Text style={styles.optionText}>Gratuito</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="zona azul" color="#00BCD4" />
              <Text style={styles.optionText}>Zona Azul</Text>
            </View>
          </View>
        </RadioButton.Group>
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
    marginBottom: 20,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: 'gray',
    marginVertical: 20,
  },
  form: {
    width: '80%',
    alignItems: 'flex-start',
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
  },
  inputText: {
    color: 'black',
    fontSize: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#00BCD4',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});