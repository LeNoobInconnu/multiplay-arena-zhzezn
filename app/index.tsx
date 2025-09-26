
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';

export default function HomeScreen() {
  console.log('HomeScreen rendered');

  const handleCreateGame = () => {
    console.log('Create game pressed');
    router.push('/create-game');
  };

  const handleJoinGame = () => {
    console.log('Join game pressed');
    router.push('/join-game');
  };

  const handleHowToPlay = () => {
    console.log('How to play pressed');
    router.push('/how-to-play');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Icon name="game-controller" size={80} color={colors.primary} />
          <Text style={commonStyles.title}>Jeu Multijoueur</Text>
          <Text style={commonStyles.textSecondary}>
            Créez ou rejoignez une partie pour commencer à jouer
          </Text>
        </View>

        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { width: '100%' }]}
            onPress={handleCreateGame}
          >
            <Text style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: '600',
            }}>
              Créer une partie
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%' }]}
            onPress={handleJoinGame}
          >
            <Text style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
            }}>
              Rejoindre une partie
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%', marginTop: 20 }]}
            onPress={handleHowToPlay}
          >
            <Text style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '500',
            }}>
              Comment jouer ?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={commonStyles.textSecondary}>
            Jeu de réaction multijoueur
          </Text>
          <Text style={commonStyles.textSecondary}>
            Soyez le plus rapide à réagir !
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
