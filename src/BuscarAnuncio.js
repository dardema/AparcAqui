import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { collection, onSnapshot } from 'firebase/firestore';

import db from './firebase';

function BuscarAnuncio() {
  const [anuncios, setAnuncios] = useState([]);

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

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{
        latitude: 39.46700755,
        longitude: -0.374352993259646,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}>
        {anuncios.map(anuncio => (
          <Marker
            key={anuncio.id}
            title={anuncio.tipocoche} 
            description={`${anuncio.horasalida} - ${anuncio.tipoaparc}`}
            coordinate={{
              latitude: anuncio.latitude,
              longitude: anuncio.longitude,
            }}
          />
        ))}
      </MapView>
    </View>
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
});