
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Icon from '../components/Icon';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  ready: boolean;
}

export default function GameLobbyScreen() {
  const params = useLocalSearchParams();
  const { gameCode, playerName, isHost, players: playersParam } = params;
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [isReady, setIsReady] = useState(false);

  console.log('GameLobbyScreen rendered with params:', params);

  useEffect(() => {
    if (playersParam && typeof playersParam === 'string') {
      try {
        const parsedPlayers = JSON.parse(playersParam);
        setPlayers(parsedPlayers);
      } catch (error) {
        console.log('Error parsing players:', error);
      }
    }
  }, [playersParam]);

  useEffect(() => {
    // Simulate game starting when all players are ready
    const allReady = players.length >= 2 && players.every(player => player.ready);
    if (allReady) {
      const timer = setTimeout(() => {
        console.log('All players ready, starting game');
        router.push({
          pathname: '/game',
          params: { 
            gameCode,
            playerName,
            isHost,
            players: JSON.stringify(players)
          }
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [players, gameCode, playerName, isHost]);

  const handleToggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    
    // Update current player's ready state
    setPlayers(prev => prev.map(player => 
      player.name === playerName 
        ? { ...player, ready: newReadyState }
        : player
    ));
  };

  const handleLeaveGame = () => {
    console.log('Leaving game');
    router.push('/');
  };

  const allPlayersReady = players.length >= 2 && players.every(player => player.ready);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={handleLeaveGame}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        >
          <Icon name="exit" size={24} color={colors.danger} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: colors.danger }}>Quitter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Icon name="people" size={60} color={colors.success} />
          <Text style={commonStyles.title}>Salle d&apos;attente</Text>
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
          
          {allPlayersReady && (
            <View style={{
              backgroundColor: colors.success,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginTop: 16,
            }}>
              <Text style={{
                color: colors.background,
                fontSize: 14,
                fontWeight: '600',
              }}>
                🎮 Démarrage de la partie...
              </Text>
            </View>
          )}
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
                  {player.name === playerName && ' (Vous)'}
                </Text>
              </View>
              
              <View style={{
                backgroundColor: player.ready ? colors.success : colors.textSecondary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              }}>
                <Text style={{
                  color: colors.background,
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  {player.ready ? 'Prêt' : 'En attente'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[
              isReady ? buttonStyles.secondary : buttonStyles.primary,
              { width: '100%' }
            ]}
            onPress={handleToggleReady}
          >
            <Text style={{
              color: isReady ? colors.text : colors.background,
              fontSize: 18,
              fontWeight: '600',
            }}>
              {isReady ? 'Annuler' : 'Je suis prêt !'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={commonStyles.textSecondary}>
            En attente que tous les joueurs soient prêts
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
