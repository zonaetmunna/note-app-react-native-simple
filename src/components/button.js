import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function Button({ title, onPress, customStyles }) {
    return (
        <TouchableOpacity style={[styles.button, customStyles]} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        width: 165,
        height: 45,
        backgroundColor: '#FFE600',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16
    }
})
