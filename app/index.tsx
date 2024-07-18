import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Alert, Platform, } from "react-native";

/**
 * Formats a number to ensure it has two digits.
 * If the number has only one digit, it adds a leading zero.
 * If the number has more than two digits, it returns the last two digits.
 *
 * @param {number} number - The number to format.
 * @return {string} - The formatted number as a string padded with a leading zero if necessary.
 */
const formatNumber = (number: number): string => {
  // Add a leading zero if the number has only one digit
  // Then slice the last two digits

  // Example:
  // Number: 5
  // Formatted Number: "05"

  // Example:
  // Number: 123
  // Formatted Number: "23"
  return `0${number}`.slice(-2);
};

/**
 * Calculates the remaining minutes and seconds from a given time in seconds.
 *
 * @param {number} time - The total time in seconds.
 * @return {{minutes: string, seconds: string}} - An object with the
 * remaining minutes and seconds as strings, padded with a leading zero if
 * necessary.
 */
const getRemaining = (time: number) => {
  // Calculate the remaining minutes and seconds
  const minutes = Math.floor(time / 60); // integer division
  const seconds = time - minutes * 60;

  // Log the values for debugging
  console.log(`time: ${time}`);
  console.log(`minutes: ${minutes}`);
  console.log(`seconds: ${seconds}`);

  // Format the minutes and seconds as strings with leading zeros if necessary
  return ({
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  });
};

/**
 * This function creates an array with the numbers from 0 to length - 1.
 * It's used to create arrays with the minutes and seconds for the picker.
 * @param {number} length - The length of the array.
 * @returns {number[]} - An array with the numbers from 0 to length - 1.
 */
const createArray = (length: number) => {
  const arr = []; // Create an empty array
  let i = 0; // Initialize a counter

  // Loop until the counter is greater than or equal to the length
  while (i < length) {
    // Push the current value of the counter to the array
    arr.push(i);
    // Increment the counter by 1
    i += 1;
  }

  // Return the array
  return arr;
};

const AVAILABLE_MINUTES = createArray(60);
const AVAILABLE_SECONDS = createArray(60);

/**
 * The main component of the app.
 * It manages the state and renders the user interface.
 */
export default function Index() {
  // State variables for the selected minutes and seconds,
  // the remaining time, and whether the countdown is running
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  /**
   * Starts the countdown with the selected minutes and seconds.
   * @returns {void}
   */
  const onStart = (): void => {
    // Calculate the total number of seconds from the selected minutes and seconds
    const totalSeconds = Number(selectedMinutes) * 60 + Number(selectedSeconds);

    // If the total seconds is not zero, start the countdown
    if (totalSeconds !== 0) {
      setIsRunning(true);
      setRemainingTime(totalSeconds);
    }
    // Otherwise, display an alert to select a time
    else {
      Alert.alert('Please select a time');
    }
  };

  /**
   * Stops the countdown.
   * @returns {void}
   */
  const onStop = () => {
    // Reset the remaining time and stop the countdown
    setRemainingTime(0);
    setIsRunning(false);
  };

  // Use the useEffect hook to start a timer that updates the remaining time every second
  useEffect (() => {
    const timer = setInterval(() => {
      if (isRunning && remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      }
    }, 1000);

    // Clean up the timer when the component is unmounted
    return () => clearInterval(timer);
  }, [isRunning, remainingTime]);

  // If the countdown is running
  if (isRunning) {
    // If the remaining time is zero, alert the user and stop the countdown
    if (remainingTime === 0) {
      Alert.alert('Time is up!');
      setIsRunning(false);
    }

    // Render the countdown UI
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.time}>
          <Text style={styles.timeText}>
            {getRemaining(remainingTime).minutes}:{getRemaining(remainingTime).seconds}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onStop}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render the UI for selecting the countdown time
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.time}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedMinutes}
          onValueChange={(itemValue) => {
            setSelectedMinutes(itemValue);
          }}
          mode="dropdown"
        >
          {AVAILABLE_MINUTES.map((value) => (
            <Picker.Item key={value} label={value.toString()} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerText}>Minutes</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedSeconds}
          onValueChange={(itemValue) => {
            setSelectedSeconds(itemValue);
          }}
          mode="dropdown"
        >
          {AVAILABLE_SECONDS.map((value) => (
            <Picker.Item key={value} label={value.toString()} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerText}>Seconds</Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    color: 'white',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  startButton: {
    width: 200,
    height: 200,
    borderColor: 'white',
    borderWidth: 4,
    borderRadius: 200 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 100,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "#07121B",
        marginLeft: 10,
      },
    })
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 250,
  },
  pickerText: {
    color: "#fff",
    fontSize: 20,
  },
  timeText: {
    color: "#fff",
    fontSize: 100,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderColor: "white",
    borderWidth: 4,
    borderRadius: 200 / 2,
  },
  buttonText: {
    color: "white",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontSize: 28,
    lineHeight: 32,
  },
});
