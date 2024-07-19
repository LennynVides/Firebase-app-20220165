import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase'; // Importa desde tu configuración de Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; // Asegúrate de importar correctamente tu configuración de Firebase
import * as LocalAuthentication from 'expo-local-authentication'; // Importa módulos de autenticación biométrica de Expo

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Función para validar el formato del correo electrónico
  const validateEmail = (email) => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar la contraseña
  const validatePassword = (password) => {
    // Validar que la contraseña tenga al menos 6 caracteres
    return password.length >= 6;
  };

  const fetchCollectionData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'practica-firebase-20220165'));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
    } catch (error) {
      console.error('Error fetching collection data:', error);
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setModalMessage("Correo electrónico no válido. Por favor, verifica tu correo.");
      setErrorModalVisible(true);
      return;
    }

    if (!validatePassword(password)) {
      setModalMessage("La contraseña debe tener al menos 6 caracteres.");
      setErrorModalVisible(true);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario ha iniciado sesión:", userCredential.user);
      setSuccessModalVisible(true); // Mostrar modal de éxito
      setEmail(''); // Limpiar el campo de correo electrónico
      setPassword(''); // Limpiar el campo de contraseña
      navigation.replace('Home'); // Reemplazar la pantalla actual con 'Home'
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      setModalMessage("Error al iniciar sesión. Por favor, verifica tus credenciales.");
      setErrorModalVisible(true); // Mostrar modal de error
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        console.log("Usuario ha iniciado sesión con Google:", result.user);
        setSuccessModalVisible(true); // Mostrar modal de éxito
        setEmail(''); // Limpiar el campo de correo electrónico
        setPassword(''); // Limpiar el campo de contraseña
        navigation.replace('Home'); // Reemplazar la pantalla actual con 'Home'
      }
    } catch (error) {
      console.error("Error iniciando sesión con Google:", error);
      setModalMessage("Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.");
      setErrorModalVisible(true); // Mostrar modal de error
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync();
      if (!compatible) {
        console.log('Autenticación biométrica no disponible en este dispositivo.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Inicia sesión con tu huella dactilar o Face ID',
      });

      if (result.success) {
        console.log('Usuario autenticado correctamente mediante biométrica.');
        // Aquí puedes realizar el inicio de sesión con Firebase u otras acciones necesarias
        setSuccessModalVisible(true); // Mostrar modal de éxito
        navigation.replace('Home'); // Reemplazar la pantalla actual con 'Home'
      } else {
        console.log('Autenticación biométrica cancelada.');
      }
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      setModalMessage('Error en autenticación biométrica. Por favor, inténtalo de nuevo.');
      setErrorModalVisible(true); // Mostrar modal de error
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register'); // Navegar a la pantalla de registro
  };

  const closeModal = () => {
    setErrorModalVisible(false);
    setSuccessModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
        <Button title="Login with Google" onPress={handleGoogleLogin} />
        <Button title="Login with Biometrics" onPress={handleBiometricLogin} />
        <Button title="Register" onPress={navigateToRegister} />

        {/* Modal para mostrar mensajes de error o éxito */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModalVisible || successModalVisible}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{successModalVisible ? 'Éxito' : 'Error'}</Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <Button title="Cerrar" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
