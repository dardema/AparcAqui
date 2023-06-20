import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Text, Modal, TouchableOpacity, Linking, Alert } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { format } from "date-fns";
import { LogBox } from 'react-native';

import db from './firebase';

function BuscarAnuncio() {
  const [anuncios, setAnuncios] = useState([]);
  const [selectedAnuncio, setSelectedAnuncio] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAnuncios = async () => {
      const aparcamientoRef = collection(db, 'aparcamiento');
      LogBox.ignoreAllLogs(true);
      const unsubscribe = onSnapshot(aparcamientoRef, (snapshot) => {
        setAnuncios(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });

      return () => {
        unsubscribe();
      };
    };

    fetchAnuncios();
  }, []);

  useEffect(() => {
    const checkReserveStatus = async () => {
      const currentTime = new Date();

      for (let anuncio of anuncios) {
        // Si el anuncio no está reservado y ha pasado 15 minutos desde la hora de salida
        if (!anuncio.reservado && currentTime.getTime() - anuncio.horasalida.toDate().getTime() >= 2 * 60 * 1000) {
          // Actualizar reservado a true
          const anuncioRef = doc(db, 'aparcamiento', anuncio.id);
          await updateDoc(anuncioRef, {
            reservado: true
          });
          console.log(`El anuncio con id: ${anuncio.id} ha sido eliminado automáticamente.`);
        }
      }
    };

    // Crear un intervalo para verificar el estado de la reserva cada minuto
    const intervalId = setInterval(checkReserveStatus, 60 * 1000);

    return () => {
      // Limpiar el intervalo cuando se desmonta el componente
      clearInterval(intervalId);
    };
  }, [anuncios]);

  const handleReserve = async (anuncio) => {
    console.log(`Reserva realizada para el anuncio con id: ${anuncio.id}`);
    setSelectedAnuncio(anuncio);

    // update reservado to true in Firestore
    const anuncioRef = doc(db, 'aparcamiento', anuncio.id);
    await updateDoc(anuncioRef, {
      reservado: true
    });

    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: 39.46700755,
        longitude: -0.374352993259646,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}>
        {anuncios
  .filter(anuncio => !anuncio.reservado) // Filtrar los anuncios que no están reservados
  .map(anuncio => (
    <Marker
      key={anuncio.id}
      coordinate={{
        latitude: anuncio.latitude,
        longitude: anuncio.longitude,
      }}
    >
      <Callout onPress={() => handleReserve(anuncio)}>
        <View>
          <Text>{anuncio.tipocoche}</Text>
          <Text>{anuncio.horasalida && anuncio.horasalida.toDate instanceof Function ? `${format(anuncio.horasalida.toDate(), 'dd/MM/yyyy HH:mm')} - ${anuncio.tipoaparc}` : 'N/A'}</Text>
          <Button title="Reservar" onPress={() => handleReserve(anuncio)} />
        </View>
      </Callout>
    </Marker>
  ))
}
      </MapView>
      <ModalReserva modalVisible={modalVisible} props={selectedAnuncio} setModalVisible={setModalVisible}/>
    </View>
  );
}

function ModalReserva({modalVisible, props, setModalVisible}) {
  // Si props es null, no hacer nada
  if (!props) {
    return null;
  }

  const handleOpenMaps = () => {
    const url = `http://maps.google.com/?q=${props.latitude},${props.longitude}`;
    Linking.openURL(url);
  };

  const handleCloseModal = () => {
    Alert.alert(
      "Cerrar Anuncio",
      "Al cerrar el anuncio confirmas el intercambio de aparcamiento",
      [
        { text: "No", style: "cancel" },
        { text: "Si", onPress: () => setModalVisible(false) } // aquí aseguramos que el modal se cierre
      ],
    );
  };

  return (
    modalVisible && (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirmación Reserva</Text>
            <Text>{props.tipocoche}</Text>
            <Text>{props.horasalida && props.horasalida.toDate instanceof Function ? `${format(props.horasalida.toDate(), 'dd/MM/yyyy HH:mm')} - ${props.tipoaparc}` : 'N/A'}</Text>
            <Button title="Ver en Maps" onPress={handleOpenMaps}/>
            <Button title="Cerrar Anuncio" onPress={handleCloseModal}/>
          </View>
        </Modal>
      </View>
    )
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi transparent background
  },
  modalView: {
    flex: 1,
    margin: 0,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  buttons: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '100%', // Make button full width
    alignItems: 'center' // Center button content
  },
});

export default BuscarAnuncio;