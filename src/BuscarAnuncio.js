import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Text, Modal, TouchableOpacity, Linking, Alert } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

import db from './firebase';

function BuscarAnuncio() {
  const [anuncios, setAnuncios] = useState([]);
  const [selectedAnuncio, setSelectedAnuncio] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAnuncios = async () => {
      const aparcamientoRef = collection(db, 'aparcamiento');
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
        if (!anuncio.reservado && currentTime.getTime() - anuncio.horasalidaFormatted.toDate().getTime() >= 10 * 60 * 1000) {
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
          <Text>{`${anuncio.horasalida} - ${anuncio.tipoaparc}`}</Text>
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
        { text: "Sí", onPress: () => setModalVisible(false) },
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
    >
      <View style={styles.modalView}>
        <Text>Tipo de coche:</Text>
        <Text>{props.tipocoche}</Text>
        <Text>Tipo de aparcamiento:</Text>
        <Text>{props.tipoaparc}</Text>
        <Text>Hora de salida:</Text>
        <Text>{props.horasalida}</Text>
        <TouchableOpacity
          style={styles.mapsButton}
          onPress={handleOpenMaps}
        >
          <Text style={styles.mapsButtonText}>Abrir en Google Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleCloseModal}
        >
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default BuscarAnuncio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 0, // Llena toda la pantalla
  },
  mapsButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
  mapsButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});