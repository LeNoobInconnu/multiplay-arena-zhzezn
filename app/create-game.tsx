
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  ready: boolean;
}

export default function CreateGameScreen() {
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameCreated, setGameCreated] = useState(false);

  console.log('CreateGameScreen rendered');

  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGame = () => {
    if (!playerName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }

    console.log('Creating game with player name:', playerName);
    const code = generateGameCode();
    setGameCode(code);
    
    const hostPlayer: Player = {
      id: 'host',
      name: playerName,
      isHost: true,
      ready: true,
    };
    
    setPlayers([hostPlayer]);
    setGameCreated(true);
  };

  const handleStartGame = () => {
    if (players.length < 1) {
      Alert.alert('Erreur', 'Impossible de démarrer la partie');
      return;
    }

    // Pour une partie solo ou locale, on peut commencer avec un seul joueur
    console.log('Starting game with players:', players);
    router.push({
      pathname: '/game',
      params: { 
        gameCode,
        playerName,
        isHost: 'true',
        players: JSON.stringify(players)
      }
    });
  };

  const handleBack = () => {
    console.log('Going back to home');
    router.back();
  };

  const handleAddLocalPlayer = () => {
    const playerNumber = players.length + 1;
    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      name: `Joueur ${playerNumber}`,
      isHost: false,
      ready: true,
    };
    
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleRemovePlayer = (playerId: string) => {
    if (playerId === 'host') return; // Ne peut pas supprimer l'hôte
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  const togglePlayerReady = (playerId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, ready: !player.ready }
        : player
    ));
  };

  if (!gameCreated) {
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
            <Icon name="add-circle" size={60} color={colors.primary} />
            <Text style={commonStyles.title}>Créer une partie</Text>
            <Text style={commonStyles.textSecondary}>
              Entrez votre nom pour créer une nouvelle partie
            </Text>
          </View>

          <View style={commonStyles.card}>
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
              onPress={handleCreateGame}
            >
              <Text style={{
                color: colors.background,
                fontSize: 18,
                fontWeight: '600',
              }}>
                Créer la partie
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Icon name="people" size={60} color={colors.success} />
          <Text style={commonStyles.title}>Configuration de la partie</Text>
          <View style={{
            backgroundColor: colors.backgroundAlt,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            marginTop: 10,
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '800',
              color: colors.primary,
              letterSpacing: 2,
            }}>
              {gameCode}
            </Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            Code de la partie (pour référence)
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Joueurs ({players.length})
          </Text>
          
          {players.map((player) => (
            <View key={player.id} style={commonStyles.playerCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon 
                  name={player.isHost ? "star" : "person"} 
                  size={20} 
                  color={player.isHost ? colors.accent : colors.primary} 
                />
                <Text style={{
                  marginLeft: 12,
                  fontSize: 16,
                  fontWeight: '500',
                  color: colors.text,
                }}>
                  {player.name}
                  {player.isHost && ' (Hôte)'}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  backgroundColor: player.ready ? colors.success : colors.textSecondary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginRight: 8,
                }}>
                  <Text style={{
                    color: colors.background,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                    {player.ready ? 'Prêt' : 'En attente'}
                  </Text>
                </View>
                
                {!player.isHost && (
                  <TouchableOpacity
                    onPress={() => handleRemovePlayer(player.id)}
                    style={{
                      padding: 4,
                    }}
                  >
                    <Icon name="close-circle" size={20} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {players.length < 4 && (
            <TouchableOpacity
              style={[commonStyles.playerCard, { 
                borderStyle: 'dashed',
                borderColor: colors.primary,
                backgroundColor: colors.primary + '10'
              }]}
              onPress={handleAddLocalPlayer}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="person-add" size={20} color={colors.primary} />
                <Text style={{
                  marginLeft: 12,
                  fontSize: 16,
                  color: colors.primary,
                  fontWeight: '500',
                }}>
                  Ajouter un joueur local
                </Text>
              </View>
              <Icon name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { width: '100%' }]}
            onPress={handleStartGame}
          >
            <Text style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: '600',
            }}>
              Commencer la partie ({players.length} joueur{players.length > 1 ? 's' : ''})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
            💡 Vous pouvez jouer seul ou ajouter des joueurs locaux pour jouer à plusieurs sur le même appareil
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
