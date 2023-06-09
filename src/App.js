import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from "react";
import { StyleSheet, View, Button, Image, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { collection, addDoc } from "firebase/firestore";

import CrearAnuncio from './CrearAnuncio';
import BuscarAnuncio from './BuscarAnuncio';
import Perfil from './Perfil';
import db from './firebase';

WebBrowser.maybeCompleteAuthSession();

const Tab = createBottomTabNavigator();

export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const Direccion = props => (
    <CrearAnuncio location={location}/>
  );

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "564036936231-vc7jue9j8nee8k25chttq79rq4oprc90.apps.googleusercontent.com",
    androidClientId: "564036936231-edgdug0o0scmb8hn52g1sa9f37psunv5.apps.googleusercontent.com",
    iosClientId: "564036936231-7ncdps44lmvi3hm187ae3n2lba31moqv.apps.googleusercontent.com",
    webClientID: "564036936231-vc7jue9j8nee8k25chttq79rq4oprc90.apps.googleusercontent.com"
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        // setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);

      // Saving user info to Firebase
      const userRef = collection(db, 'usuarios');
      await addDoc(userRef, user);

    } catch (error) {
      console.log("Ha ocurrido un error con el inicio de sesión");
    }
  };

  return (
    <NavigationContainer>
      {!userInfo ? (
        <View style={styles.container}>
          <Text style={styles.title}>AparcAquí</Text>
          <Button
            title="Sign in with Google"
            color="black"
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          />
        </View>
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Crear Anuncio" component={Direccion} />
          <Tab.Screen name="Buscar Anuncio" component={BuscarAnuncio} />
          <Tab.Screen name="Perfil">
            {props => (
              <Perfil{...props} userInfo={userInfo} setUserInfo={setUserInfo}/>)}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'gray',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
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