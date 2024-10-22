
import React, { Component, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ImageBackground, 
  Image,
  TouchableHighlight,
  Alert
} from 'react-native';

import Dark  from './components/dark.js'
import Light from './components/light.js'
import Blue from './components/blue.js'

import axios from 'axios';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class App extends Component {

  state = {
    background: null,
    precip: null,
    temp: null,
  }

  componentDidMount() {

    let currentHour = new Date().getHours()

    if (21 <= currentHour && currentHour <= 24 || 1 <= currentHour && currentHour < 5){
      this.setState({
        background: 'dark'
      })
    } else if (5 <= currentHour && currentHour < 8 ){
      this.setState({
        background: 'blue'
      })
    } else if (8 <= currentHour && currentHour < 19){
      this.setState({
        background: 'light'
      })
    } else if (19 <= currentHour < 21){
      this.setState({
        background: 'blue'
      })
    }

    axios
    .get('http:api.openweathermap.org/data/2.5/weather?q=Los Angeles&appid=76214c5cd81fe6ccd40bdb94cbcda133')
    .then(function(response) {

      let temp = response.data.main.temp
      const celsius = temp - 273;
      let fahrenheit = Math.floor(celsius * (9/5) + 32);

      this.setState({ 
        precip: response.data.weather[0].main,
        temp: fahrenheit
      })

    }.bind(this))
    .catch(function () {
      console.log("Promise Rejected");
    });

    this.timer = setInterval(() => this.sendLocalNotification(), 5000);

    PushNotificationIOS.addEventListener(
      'localNotification',
      this.onLocalNotification,
    );
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener(
      'localNotification',
      this.onLocalNotification,
    );
    clearInterval(this.timer)
  }

  contents(){
    return (
      <View style={styles.smallContainer}>
        {this.renderIcon()}
        <Text style={styles.large}>{this.state.temp}°</Text>
      </View>
    )
  }

  renderBackground(){
    if(this.state.background === 'dark'){
      return(
        <Dark>
          {this.contents()}
        </Dark>
      )
    } else if(this.state.background === 'blue'){
      return(
        <Blue>
          {this.contents()}
        </Blue>
      )
    } else if(this.state.background === 'light'){
      return(
        <Light>
          {this.contents()}
        </Light>
      )
    }
  }

  renderIcon(){
    if(this.state.precip == 'Clear'){
      return(
        <Image source={require('./assets/png/sun.png')} style={styles.tinyLogo}/>
      )
    } else if(this.state.precip == 'Clouds'){
      return(
        <Image source={require('./assets/png/cloudy.png')} style={styles.tinyLogo}/>
      )
    } else if(this.state.precip == 'Rainy'){
      return(
        <Image source={require('./assets/png/rain.png')} style={styles.tinyLogo}/>
      )
    } else {
      return(
        <Image source={require('./assets/png/weather-vane.png')} style={styles.tinyLogo}/>
      )
    }
  }

  sendLocalNotification = () => {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'Your Weather Report',
      alertBody: `${this.state.precip}, ${this.state.temp}°`,
      applicationIconBadgeNumber: 1,
    });
  };

  onLocalNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1

    Alert.alert(
      'Local Notification Received',
      `${notification.getTitle()}
      ${notification.getMessage()}`,
      [
        {
          text: 'Dismiss',
          onPress: null,
        },
      ],
    )
  };

  render() {
    return(
      <View style={styles.container}>
        {this.renderBackground()}   
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  smallContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    paddingTop: 100,
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold"
  },
  tinyLogo: {
    width: 120,
    height: 120,
    tintColor: 'white',
    marginRight: 40
  },
  large: {
    fontSize: 70,
    color: 'white'
  }
});

export default App;
