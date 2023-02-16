import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect} from 'react';
import * as Location from 'expo-location';
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
  Atmosphere: "cloudy-gusts"
}

export default function App() {
  const [city, setCity] = useState("Loding...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
    );
    setCity(location[0].city);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric&lang=kr`);
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal={true} 
        pagingEnabled={true} 
        // indicatorStyle="white"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
        <View style={{ ...styles.day, alignItems: "center" }}>
          <ActivityIndicator 
            color="white" 
            style={{marginTop: 10}} 
            size="large" 
          />
        </View>
        ) : (
        days.map((day, index) => (
          <View key={index} style={styles.day}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <Text style={styles.date}>{new Date(day.dt * 1000).getDate()}일 {'일월화수목금토'.charAt(new Date(day.dt * 1000).getUTCDay())}요일</Text>
              <Fontisto style={{marginLeft: 15}} name={icons[day.weather[0].main]} size={25} color="white" />
            </View>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(0)}°</Text>
            <Text style={styles.description}>{day.weather[0].description}</Text>
          </View>
        ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "tomato"
  },
  city: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 48,
    fontWeight: "500",
    color: "#ffffff",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  date: {
    fontSize: 30,
    color: "#ffffff",
  }, 
  temp: {
    marginTop: 5,
    fontSize: 178,
    color: "#ffffff",
  },
  description: {
    marginTop: -5,
    fontSize: 40,
    color: "#ffffff",
  }
})