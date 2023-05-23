import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image,TextInput, TouchableOpacity, FlatList, Modal } from "react-native";
import MapView, { Marker } from 'react-native-maps';

function BuscarAnuncio() {
    const [anuncios, setAnuncios] = useState([
      {
        id: '1',
        title: 'C/ Colón 6',
        carType: 'Grande',
        arrivalTime: '15 min',
        location: '',
        latitude: 39.4683141,
        longitude: -0.3657243,
      },
      {
        id: '2',
        title: 'Gran Via de les Germanies 27',
        carType: 'Mediano',
        arrivalTime: '10 min',
        location: '',
        latitude: 39.464109,
        longitude: -0.375711,
      },
      {
        id: '3',
        title: 'C/ Acequia Mislata 4',
        carType: 'Pequeño',
        arrivalTime: '5 min',
        location: '',
        latitude: 39.428992,
        longitude: -0.405266,
      },
    ]);
  
    useEffect(() => {
      const getAddressFromLatLng = async (latitude, longitude) => {
        try {
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBZLVJ1aE-nJIIahce8fVZqU2AYdWjuMuQ`);
          const data = await response.json();
          if (data.status === 'OK') {
            return data.results[0].formatted_address;
          } else {
            return '';
          }
        } catch (error) {
          console.error(error);
          return '';
        }
      };
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
              title={anuncio.title}
              description={`${anuncio.carType} - ${anuncio.arrivalTime} - ${anuncio.location}`}
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
      listContainer: {
        flex: 0.4, // asigna el 40% de la altura a la lista
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