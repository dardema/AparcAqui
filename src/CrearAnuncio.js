import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform, TextInput } from "react-native";
import { RadioButton } from 'react-native-paper'; 
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker'; 
import RNPickerSelect from "react-native-picker-select"; 

import db from './firebase';

function CrearAnuncio(location) {

  const [tipocoche, setTipocoche] = useState('');
  const [horasalida, setHorasalida] = useState(new Date());
  const [direccion, setDireccion] = useState('');
  const [tipoaparc, setTipoaparc] = useState('gratuito');
  const [show, setShow] = useState(false);

  const handleSubmit = async () => {

    const anuncioData = {
      tipocoche: tipocoche,
      horasalida: horasalida,
      tipoaparc: tipoaparc,
      longitude: location.location.coords.longitude,
      latitude: location.location.coords.latitude,
    };

    try {
      const aparcamientoRef = collection(db, 'aparcamiento');
      await addDoc(aparcamientoRef, anuncioData);

      console.log("Datos guardados exitosamente");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setHorasalida(currentDate);
  };

  const showTimepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anuncio</Text>
      <View style={styles.separator} />
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
          <TouchableOpacity onPress={showTimepicker} style={styles.input}>
            <Text style={styles.inputText}>{horasalida.toTimeString()}</Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={horasalida}
              mode={'time'}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
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