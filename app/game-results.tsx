
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  ready: boolean;
  score?: number;
  territories?: number;
  color?: string;
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
    console.log('Play again clicked');
    router.push({
      pathname: '/game-lobby',
      params: { 
        gameCode,
        playerName,
        players: JSON.stringify(players.map(p => ({ ...p, ready: false })))
      }
    });
  };

  const handleBackHome = () => {
    console.log('Back to home clicked');
    router.push('/');
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎖️';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return colors.accent;
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return colors.textSecondary;
    }
  };

  const sortedPlayers = [...players].sort((a, b) => (b.territories || 0) - (a.territories || 0));
  const winner = sortedPlayers[0];
  const currentPlayer = players.find(p => p.name === playerName);
  const currentPlayerRank = sortedPlayers.findIndex(p => p.name === playerName) + 1;

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={commonStyles.title}>Résultats de la Partie</Text>
          <Text style={commonStyles.textSecondary}>
            Conquête de Territoires - Code: {gameCode}
          </Text>
        </View>

        {/* Winner Announcement */}
        <View style={[commonStyles.gameCard, { marginBottom: 30 }]}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>
            {winner?.name === playerName ? '🎉' : '👑'}
          </Text>
          
          <Text style={[commonStyles.subtitle, { color: winner?.color || colors.accent }]}>
            {winner?.name === playerName ? 'Félicitations !' : `${winner?.name} a gagné !`}
          </Text>
          
          <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
            {winner?.territories || 0} territoires conquis
          </Text>

          {winner?.name === playerName && (
            <View style={{
              backgroundColor: colors.success + '20',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginTop: 16,
            }}>
              <Text style={{
                color: colors.success,
                fontSize: 14,
                fontWeight: '600',
              }}>
                Victoire ! 🎊
              </Text>
            </View>
          )}
        </View>

        {/* Personal Stats */}
        {currentPlayer && (
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              Vos Statistiques
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>
                  {getRankEmoji(currentPlayerRank)}
                </Text>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: getRankColor(currentPlayerRank),
                }}>
                  #{currentPlayerRank}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Position
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 32,
                  fontWeight: '800',
                  color: colors.primary,
                  marginBottom: 8,
                }}>
                  {currentPlayer.territories || 0}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Territoires
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 32,
                  fontWeight: '800',
                  color: colors.accent,
                  marginBottom: 8,
                }}>
                  {Math.round(((currentPlayer.territories || 0) / 36) * 100)}%
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Contrôle
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Full Rankings */}
        <View style={[commonStyles.card, { marginBottom: 30 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Classement Final
          </Text>
          
          {sortedPlayers.map((player, index) => (
            <View key={player.id} style={[
              commonStyles.playerCard,
              player.name === playerName && { 
                backgroundColor: colors.primary + '20',
                borderWidth: 2,
                borderColor: colors.primary + '40',
              }
            ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: player.color || getRankColor(index + 1),
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
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 4,
                  }}>
                    {player.name}
                    {player.name === playerName && ' (Vous)'}
                    {index === 0 && ' 👑'}
                  </Text>
                  
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                  }}>
                    {player.territories || 0} territoires • {Math.round(((player.territories || 0) / 36) * 100)}% de contrôle
                  </Text>
                </View>
                
                <Text style={{ fontSize: 24 }}>
                  {getRankEmoji(index + 1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { width: '100%' }]}
            onPress={handlePlayAgain}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="refresh" size={20} color={colors.background} />
              <Text style={{
                color: colors.background,
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 8,
              }}>
                Rejouer
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%' }]}
            onPress={handleBackHome}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="home" size={20} color={colors.text} />
              <Text style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 8,
              }}>
                Retour à l&apos;accueil
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Game Summary */}
        <View style={[commonStyles.card, { marginTop: 20, backgroundColor: colors.backgroundAlt }]}>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 12 }]}>
            🎮 Partie de Conquête de Territoires terminée
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontSize: 12, marginTop: 4 }]}>
            {players.length} joueurs • Code: {gameCode}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
