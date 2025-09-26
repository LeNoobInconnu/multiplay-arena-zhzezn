
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';

export default function JoinGameScreen() {
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');

  console.log('JoinGameScreen rendered');

  const handleJoinGame = () => {
    if (!playerName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }

    if (!gameCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le code de la partie');
      return;
    }

    if (gameCode.length !== 6) {
      Alert.alert('Erreur', 'Le code de la partie doit contenir 6 caractères');
      return;
    }

    console.log('Joining game with code:', gameCode, 'and name:', playerName);
    
    // Simulate joining a game
    const mockPlayers = [
      { id: 'host', name: 'Hôte', isHost: true, ready: true },
      { id: 'player1', name: playerName, isHost: false, ready: false },
    ];

    router.push({
      pathname: '/game-lobby',
      params: { 
        gameCode,
        playerName,
        isHost: 'false',
        players: JSON.stringify(mockPlayers)
      }
    });
  };

  const handleBack = () => {
    console.log('Going back to home');
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={handleBack}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: colors.text }}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Icon name="enter" size={60} color={colors.primary} />
          <Text style={commonStyles.title}>Rejoindre une partie</Text>
          <Text style={commonStyles.textSecondary}>
            Entrez le code de la partie et votre nom
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.text, { marginBottom: 12, textAlign: 'left' }]}>
            Code de la partie :
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 18,
              backgroundColor: colors.backgroundAlt,
              marginBottom: 20,
              textAlign: 'center',
              letterSpacing: 2,
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
            placeholder="XXXXXX"
            value={gameCode}
            onChangeText={(text) => setGameCode(text.toUpperCase())}
            maxLength={6}
            autoCapitalize="characters"
          />

          <Text style={[commonStyles.text, { marginBottom: 12, textAlign: 'left' }]}>
            Votre nom :
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              backgroundColor: colors.backgroundAlt,
              marginBottom: 20,
            }}
            placeholder="Entrez votre nom"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
          />

          <TouchableOpacity
            style={[buttonStyles.primary, { width: '100%' }]}
            onPress={handleJoinGame}
          >
            <Text style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: '600',
            }}>
              Rejoindre la partie
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={commonStyles.textSecondary}>
            Demandez le code à l&apos;hôte de la partie
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
