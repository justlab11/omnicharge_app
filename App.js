/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  NativeEventEmitter,
  Dimensions,
  AsyncStorage,
  NativeModules,
  Alert,
  View,
} from 'react-native';
import {LineChart} from "react-native-chart-kit";


//       if using react-native-ble-manager
// import BleManager from "react-native-ble-manager";
// const bleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(bleManagerModule);

const Header = () => {
  return (
      <View style={styles.header}>
        <Text style={styles.text}>Omni Charge</Text>
      </View>
    );
};

const Plot = (props) => {
  let time = (JSON.stringify(props.data.x) !== "[]") ? props.data.x : ["0"];
  let dp = (JSON.stringify(props.data.y) !== "[]") ? props.data.y : [0];
  // console.log(time)
  return (
    <View style={styles.window}>
      <Text style={{height:20, color:"#fff", width:"100%", textAlign:"center"}}>{props.text}</Text>
      <LineChart
        data={{
          labels: time,
          datasets: [
            {
              data: dp,
            }
          ]
        }}
        width={Dimensions.get("window").width*.95}
        height={280}
        // yAxisInterval="31"
        chartConfig={{
            backgroundColor: "#31393c",
            backgroundGradientFrom: "#31393c",
            backgroundGradientTo:"#31393c",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {borderRadius: 8},
        }}
        verticalLabelRotation={60}
        xLabelsOffset={-10}
      />
    </View>
  );
};

// const d1 = {
//   "x": ["11:30","b","c"],
//   "y": [15,11,23]
// };
// const d2 = {
//   "x": ["x","y","z"],
//   "y": [1,7,12]
// };
// const d3 = {
//   "x": ["jan","feb","mar","jan","feb","mar","jan","feb","mar","jan","feb","mar","jan","feb","mar","jan","feb","mar"],
//   "y": [0,4,16,0,4,16,0,4,16,0,4,16,0,4,16,0,4,16]
// };

let saveData = async (key, item) => {
  return AsyncStorage.setItem(key, JSON.stringify(item))
        .catch(error => Alert.alert("Error","An error occurred when trying to save the data."))
};
let retrieveData = async (key) => {
  return AsyncStorage.getItem(key)
        .then(req => JSON.parse(req))
        .catch(error => Alert.alert("Error","An error occurred when trying to retrieve the data."))
};

let getAllKeys = async () => {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
  } catch(e) {
    console.log(e)
  }    // read key error  }
  console.log(keys)  // example console.log result:  // ['@MyApp_user', '@MyApp_key']
};

let appendArr = (arr, new_val) => {
  if (arr.length > 30) arr.shift();
  arr.push(new_val)
}

const App = () => {
  // stringify array (JSON.stringify) -> save array -> retrieve array -> parse array (JSON.parse)
  // keys will be "time" for times and "dp1", "dp2", "dp3" for datapoints
  let d1 = {"x":[], "y":[]};
  let d2 = {"x":[], "y":[]};
  let d3 = {"x":[], "y":[]};

  const [time, setTime] = useState([]);
  const [dp1, setDP1] = useState([]);
  const [dp2, setDP2] = useState([]);
  const [dp3, setDP3] = useState([]);

  useEffect(() => {
    // retrieveData("time").then(req => console.log(req));
    // getAllKeys();
    // retrieveData("time").then(req => console.log(req));

    retrieveData("dp1").then(val => val !== null ? setTime(val) : setTime([]));
    retrieveData("dp1").then(val => val !== null ? setDP1(val) : setDP1([]));
    retrieveData("dp2").then(val => val !== null ? setDP2(val) : setDP2([]));
    retrieveData("dp3").then(val => val !== null ? setDP3(val) : setDP3([]));
    d1 = {"x":time, "y":dp1};
    d2 = {"x":time, "y":dp2};
    d3 = {"x":time, "y":dp3};
    // console.log(d1.x === "[]");
  }, []);

  useEffect(() => {
    saveData("time", time);
    saveData("dp1", dp1);
    saveData("dp2", dp2);
    saveData("dp3", dp3);
    d1 = {"x":time, "y":dp1};
    d2 = {"x":time, "y":dp2};
    d3 = {"x":time,"y":dp3};
    // console.log(JSON.stringify(d1.x) === "[]")
  }, [time]);

  // let time = retrieveData("time")
  // let d1 = {
  //   "x": time,
  //   "y": retrieveData("dp1")
  // }
  // let d2 = {
  //   "x": time,
  //   "y": retrieveData("dp2")
  // }
  // let d3 = {
  //   "x": time,
  //   "y": retrieveData("dp3")
  // }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: "center"}}>
      <StatusBar style={styles.statBar}/>
      <Header />
      <Plot text="Hello" data={d1}/>
      <Plot text="Hi" data={d2}/>
      <Plot text="yes" data={d3}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  statBar: {
    backgroundColor: "#764B8E",
  },
  header: {
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: "#764B8E",
    height: 50,
    width: "100%"
  },
  window: {
    marginHorizontal: 0,
    marginTop: 20,
    backgroundColor: "#31393c",
    width: "95%",
    flex: 1,
    height: 300,
    shadowOffset: {
      width:0,
      height:2
    },
    shadowOpacity:.1,
    shadowRadius:2,
  },
  text: {
    width:"100%",
    height:"100%",
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    textAlignVertical: "center"
  },
  scrollView: {
    backgroundColor: "#21292c",
    flexDirection: "column",
  }
});

export default App;
