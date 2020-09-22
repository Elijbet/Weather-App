import React, { Component } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

function ChangingBackground(props) {
  return (
    <ImageBackground source={require('../assets/images/dark.jpeg')} style={styles.image}>
      {props.children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});

export default ChangingBackground;