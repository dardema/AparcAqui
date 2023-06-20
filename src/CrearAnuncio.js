import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Modal, Alert } from "react-native";
import { RadioButton } from 'react-native-paper';
import { doc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from "react-native-picker-select";
import { Timestamp } from "firebase/firestore";

import db from './firebase';

function CrearAnuncio(location) {
  const [tipocoche, setTipocoche] = useState('');
  const [horasalida, setHorasalida] = useState(new Date());
  const [tipoaparc, setTipoaparc] = useState('gratuito');
  const [reservado, setReservado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [docId, setDocId] = useState('');

  const handleSubmit = async () => {
    const anuncioData = {
      tipocoche: tipocoche,
      horasalida: Timestamp.fromDate(horasalida), // Guarda como timestamp de Firebase
      tipoaparc: tipoaparc,
      reservado: reservado,
      longitude: location.location.coords.longitude,
      latitude: location.location.coords.latitude,
    };
  
    try {
      const aparcamientoRef = collection(db, 'aparcamiento');
      const docRef = await addDoc(aparcamientoRef, anuncioData);
  
      console.log("Datos guardados exitosamente");
      setDocId(docRef.id);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const closeModal = async () => {
    setModalVisible(false);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setHorasalida(currentDate);
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
            <Text style={styles.modalText}>Hora de salida: {horasalida.toString()}</Text>
            <Text style={styles.modalText}>Tipo de aparcamiento: {tipoaparc}</Text>
            <Button title="Cerrar y Confirmar" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    
  <View style={styles.form}>
     
  <Text style={[styles.label, { textAlign: 'center' }]}>Tamaño de coche:</Text>
  
  <View style={styles.inputContainer}>
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
  </View>

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
              <RadioButton value="Gratuito" color="black" />
              <Text style={styles.optionText}>Gratuito</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Zona azul" color="black" />
              <Text style={styles.optionText}>Zona Azul</Text>
            </View>
          </View>
        </RadioButton.Group>
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText} onPress={handleSubmit}>Enviar</Text>
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
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: 'gray',
    marginVertical: 20,
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
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
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
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
    textAlign: "center",
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});