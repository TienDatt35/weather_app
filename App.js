import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import axios from "axios";

export default function App() {
  const [weathers, setWeathers] = useState([]);
  const [city, setCity] = useState("");
  const [days, setDays] = useState(0);

  const getWeather = async () => {
    try {
      // get API từ openweathermap với query city, days và appid là API key được láYa từ openweathermap
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${days}&mode=json&units=metric&appid=886705b4c1182eb1c69f28eb8c520e20`
      );

      // sau khi đã lấy được kết quả, ta sẽ chuyển đổi object trong mảng thành object phù hợp như yêu cầu bao gồm:
      // nhiệt độ, ngày, thời tiết, độ ẩm, áp suất, tốc độ gió
      const mapRes = res.data.list.map((e) => ({
        temp: e.temp.day,
        date: getFormattedDate(new Date(e.dt * 1000)),
        weather: e.weather[0].description,
        humidity: e.humidity,
        pressure: e.pressure,
        speed: e.speed,
      }));

      setWeathers(mapRes);
    } catch (e) {
      console.log(e);
    }
  };

  function getFormattedDate(date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={city}
        placeholder="Input city..."
        style={styles.input}
        onChangeText={(text) => setCity(text)}
      />
      <TextInput
        value={days}
        style={styles.input}
        placeholder="Input number of days to forecast..."
        onChangeText={(text) => setDays(text)}
      />
      <Button
        onPress={() => getWeather()}
        title="Get"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <View>
        {!!city && !!days && !!weathers.length > 0 && (
          <Text style={{ fontWeight: "bold", fontSize: 24 }}>
            {city.toUpperCase()} in {days} next {days > 1 ? "days" : "day"}
          </Text>
        )}
      </View>

      {weathers.map((e, index) => (
        <View
          key={index}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text>Date: {e.date} </Text>
          <Text> | Temp: {e.temp}</Text>
          <Text> | Weather: {e.weather}</Text>
          <Text> | Humidity: {e.humidity}%</Text>
          <Text> | Pressure: {e.pressure}at</Text>
          <Text> | Speed: {e.speed}km/h</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
