import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Text, Modal, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'; // import updateDoc

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

  console.log(props.horasalida);
  return (
    <Modal
      animationType="slide"
      transparent={true}
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
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(false);
            }}
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
    margin: 20,
    borderRadius: 20,
    padding: 35,
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
