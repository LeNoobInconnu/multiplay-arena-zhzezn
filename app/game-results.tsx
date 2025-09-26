
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
  score?: number;
  reactionTime?: number;
}

export default function GameResultsScreen() {
  const params = useLocalSearchParams();
  const { gameCode, playerName, players: playersParam } = params;
  
  const [players, setPlayers] = useState<Player[]>([]);

  console.log('GameResultsScreen rendered with params:', params);

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

  const handlePlayAgain = () => {
    console.log('Play again pressed');
    router.push({
      pathname: '/create-game',
    });
  };

  const handleBackHome = () => {
    console.log('Back to home pressed');
    router.push('/');
  };

  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const winner = sortedPlayers[0];
  const playerRank = sortedPlayers.findIndex(p => p.name === playerName) + 1;

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return colors.accent;
      case 2: return colors.textSecondary;
      case 3: return '#CD7F32';
      default: return colors.primary;
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>
            {getRankEmoji(playerRank)}
          </Text>
          <Text style={commonStyles.title}>
            {playerRank === 1 ? 'Félicitations !' : 'Bien joué !'}
          </Text>
          <Text style={commonStyles.textSecondary}>
            {playerRank === 1 
              ? 'Vous avez gagné la partie !' 
              : `Vous êtes ${playerRank}${playerRank === 2 ? 'ème' : playerRank === 3 ? 'ème' : 'ème'} !`
            }
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 20, textAlign: 'center' }]}>
            🏆 Classement Final
          </Text>
          
          {sortedPlayers.map((player, index) => (
            <View key={player.id} style={[
              commonStyles.playerCard,
              {
                backgroundColor: player.name === playerName 
                  ? colors.primary + '20' 
                  : index === 0 
                    ? colors.accent + '10'
                    : colors.backgroundAlt,
                borderWidth: player.name === playerName ? 2 : 0,
                borderColor: colors.primary,
              }
            ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: getRankColor(index + 1),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Text style={{
                    color: colors.background,
                    fontSize: 18,
                    fontWeight: '800',
                  }}>
                    {index + 1}
                  </Text>
                </View>
                <View>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                  }}>
                    {player.name}
                    {player.name === playerName && ' (Vous)'}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                  }}>
                    Temps moyen: {Math.round(player.reactionTime || 0)}ms
                  </Text>
                </View>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: getRankColor(index + 1),
                }}>
                  {Math.round(player.score || 0)}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                }}>
                  points
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16, textAlign: 'center' }]}>
            📊 Statistiques
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '800',
                color: colors.primary,
              }}>
                {gameCode}
              </Text>
              <Text style={commonStyles.textSecondary}>Code partie</Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '800',
                color: colors.success,
              }}>
                {players.length}
              </Text>
              <Text style={commonStyles.textSecondary}>Joueurs</Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '800',
                color: colors.accent,
              }}>
                3
              </Text>
              <Text style={commonStyles.textSecondary}>Manches</Text>
            </View>
          </View>
        </View>

        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { width: '100%' }]}
            onPress={handlePlayAgain}
          >
            <Text style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: '600',
            }}>
              Rejouer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%' }]}
            onPress={handleBackHome}
          >
            <Text style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '500',
            }}>
              Retour à l&apos;accueil
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
