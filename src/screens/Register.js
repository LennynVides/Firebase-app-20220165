import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; // Asegúrate de importar correctamente
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; // Asegúrate de importar correctamente tu configuración de Firebase

const Register = ({ navigation }) => {
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

  const handleRegister = async () => {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario registrado:", userCredential.user);
      setSuccessModalVisible(true); // Mostrar modal de éxito
      setEmail(''); // Limpiar el campo de correo electrónico
      setPassword(''); // Limpiar el campo de contraseña
      navigation.navigate('Login'); // Navegar a la pantalla de login
    } catch (error) {
      console.error("Error registrando usuario:", error);
      setModalMessage("Error al registrar usuario. Por favor, inténtalo de nuevo.");
      setErrorModalVisible(true); // Mostrar modal de error
    }
  };

  const closeModal = () => {
    setErrorModalVisible(false);
    setSuccessModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address" // Configura el teclado para direcciones de correo electrónico
          autoCapitalize="none" // Desactiva la autocorrección de mayúsculas
          autoCompleteType="email" // Habilita el autocompletado de tipo de correo electrónico
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <Button title="Register" onPress={handleRegister} />

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

export default Register;
