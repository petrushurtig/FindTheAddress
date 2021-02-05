import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import MapView, { Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [location, setLocation] = useState(null);
  const [searched, setSearched] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
    }
    else {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLat(Number(location.coords.latitude));
      setLong(Number(location.coords.longitude));
    }
  };

  const getRegion = () => {
    var url = "http://www.mapquestapi.com/geocoding/v1/address?key=ntGiB5xeGwAEUqKTkfmUsT5MSjlIj0De&location=" + searched.replace(/\s+/g, '');
    fetch(url)
    .then((res) => res.json())
    .then((res) => {
      setLat(Number(res.results[0].locations[0].displayLatLng.lat));
      console.log(lat);
      setLong(Number(res.results[0].locations[0].displayLatLng.lng));
      console.log(long)
    })
    .catch((error) => {
      Alert.alert('Error', error.message);
    })
  }
  
  const [number1, number2] = [Number(lat), Number(long)];

  return (
    <View style={styles.container}>
      <MapView
      style={{ height:'70%', width:'80%' }}
      region={{
        latitude: number1,
        longitude: number2,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      }}
      >
       <Marker 
      coordinate={{
        latitude: number1,
        longitude: number2}}
        title={searched}/>
      </MapView>
      <TextInput style={{width:'70%', height:40, margin:5, borderBottomColor:'black', borderBottomWidth: 1}} value={searched} onChangeText={(val) => setSearched(val)}></TextInput>
      <Button  onPress={getRegion} title="Search"></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
