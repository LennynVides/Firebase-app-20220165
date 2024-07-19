import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase'; // Importa la configuración de Firebase
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'; // Importa funciones de Firestore para consultas en tiempo real
import CardProductos from '../components/CardProductos'; // Importa el componente de tarjeta de producto

const Home = ({ navigation }) => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const q = query(collection(database, 'productos'), orderBy('creado', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            setProductos(docs);
        });

        return () => unsubscribe();
    }, []);

    const goToAdd = () => { 
        navigation.navigate('Add');
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log('Usuario ha cerrado sesión');
            navigation.replace('Login'); // Reemplaza la navegación hacia Login en lugar de simplemente navegar
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const renderItem = ({ item }) => (
        <CardProductos
            id={item.id}
            nombre={item.nombre}
            precio={item.precio}
            vendido={item.vendido}
            imagen={item.imagen}
        />
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Productos Disponibles</Text>

            {
                productos.length !== 0 ?
                <FlatList
                    data={productos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
                : 
                <Text style={styles.subtitle}>No hay productos disponibles</Text>
            }

            <TouchableOpacity
                style={styles.addButton}
                onPress={goToAdd}>
                <Text style={styles.buttonText}>Agregar Producto</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#ff9800'
    },
    addButton: {
        backgroundColor: '#0288d1',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        marginHorizontal: 50,
        paddingVertical: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    list: {
        flexGrow: 1,
    },
    signOutButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
    },
    signOutText: {
        color: '#0288d1',
        fontWeight: 'bold',
    },
});

export default Home;