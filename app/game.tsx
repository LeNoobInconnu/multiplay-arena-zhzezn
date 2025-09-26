
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
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

interface GameState {
  phase: 'waiting' | 'ready' | 'go' | 'finished';
  round: number;
  maxRounds: number;
}

export default function GameScreen() {
  const params = useLocalSearchParams();
  const { gameCode, playerName, players: playersParam } = params;
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    phase: 'waiting',
    round: 1,
    maxRounds: 3,
  });
  const [startTime, setStartTime] = useState<number>(0);
  const [playerReacted, setPlayerReacted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  console.log('GameScreen rendered with params:', params);

  useEffect(() => {
    if (playersParam && typeof playersParam === 'string') {
      try {
        const parsedPlayers = JSON.parse(playersParam);
        const playersWithScores = parsedPlayers.map((player: Player) => ({
          ...player,
          score: 0,
        }));
        setPlayers(playersWithScores);
      } catch (error) {
        console.log('Error parsing players:', error);
      }
    }
  }, [playersParam]);

  useEffect(() => {
    if (gameState.phase === 'waiting') {
      // Start countdown
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setGameState(prev => ({ ...prev, phase: 'ready' }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [gameState.phase]);

  useEffect(() => {
    if (gameState.phase === 'ready') {
      // Wait random time between 2-5 seconds then show GO
      const randomDelay = Math.random() * 3000 + 2000;
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, phase: 'go' }));
        setStartTime(Date.now());
        setPlayerReacted(false);
        
        // Animate the button
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            useNativeDriver: true,
          }),
          Animated.timing(colorAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }, randomDelay);

      return () => clearTimeout(timer);
    }
  }, [gameState.phase, scaleAnim, colorAnim]);

  const handleReaction = () => {
    if (gameState.phase !== 'go' || playerReacted) return;

    const reactionTime = Date.now() - startTime;
    setPlayerReacted(true);
    
    console.log('Player reacted in:', reactionTime, 'ms');

    // Update player score
    setPlayers(prev => prev.map(player => 
      player.name === playerName 
        ? { 
            ...player, 
            score: (player.score || 0) + Math.max(1000 - reactionTime, 0),
            reactionTime 
          }
        : {
            ...player,
            reactionTime: Math.random() * 800 + 200, // Simulate other players
            score: (player.score || 0) + Math.max(1000 - (Math.random() * 800 + 200), 0)
          }
    ));

    // Move to next round or finish game
    setTimeout(() => {
      if (gameState.round >= gameState.maxRounds) {
        setGameState(prev => ({ ...prev, phase: 'finished' }));
      } else {
        setGameState(prev => ({ 
          ...prev, 
          phase: 'waiting', 
          round: prev.round + 1 
        }));
        // Reset animations
        scaleAnim.setValue(1);
        colorAnim.setValue(0);
      }
    }, 2000);
  };

  const handleFinishGame = () => {
    console.log('Finishing game');
    router.push({
      pathname: '/game-results',
      params: { 
        gameCode,
        playerName,
        players: JSON.stringify(players)
      }
    });
  };

  const handleLeaveGame = () => {
    console.log('Leaving game');
    router.push('/');
  };

  const getButtonColor = () => {
    if (gameState.phase === 'go') {
      return colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.danger, colors.success],
      });
    }
    return colors.primary;
  };

  const getButtonText = () => {
    switch (gameState.phase) {
      case 'waiting':
        return countdown > 0 ? countdown.toString() : 'Préparez-vous...';
      case 'ready':
        return 'Attendez...';
      case 'go':
        return playerReacted ? 'Réagi !' : 'APPUYEZ !';
      case 'finished':
        return 'Partie terminée';
      default:
        return '';
    }
  };

  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleLeaveGame}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon name="exit" size={24} color={colors.danger} />
            <Text style={{ marginLeft: 8, fontSize: 16, color: colors.danger }}>Quitter</Text>
          </TouchableOpacity>
          
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
            Manche {gameState.round}/{gameState.maxRounds}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={commonStyles.title}>Jeu de Réaction</Text>
          <Text style={commonStyles.textSecondary}>
            Appuyez dès que le bouton devient vert !
          </Text>
        </View>

        <View style={[commonStyles.gameCard, { minHeight: 300, justifyContent: 'center' }]}>
          {gameState.phase !== 'finished' ? (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  {
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: gameState.phase === 'go' ? colors.success : 
                                   gameState.phase === 'ready' ? colors.danger : colors.primary,
                  }
                ]}
                onPress={handleReaction}
                disabled={gameState.phase !== 'go' || playerReacted}
              >
                <Text style={{
                  color: colors.background,
                  fontSize: 24,
                  fontWeight: '800',
                  textAlign: 'center',
                }}>
                  {getButtonText()}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Icon name="trophy" size={60} color={colors.accent} />
              <Text style={[commonStyles.subtitle, { marginTop: 16 }]}>
                Partie terminée !
              </Text>
              <TouchableOpacity
                style={[buttonStyles.primary, { marginTop: 20 }]}
                onPress={handleFinishGame}
              >
                <Text style={{
                  color: colors.background,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Voir les résultats
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Classement
          </Text>
          
          {sortedPlayers.map((player, index) => (
            <View key={player.id} style={[
              commonStyles.playerCard,
              player.name === playerName && { backgroundColor: colors.primary + '20' }
            ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: index === 0 ? colors.accent : colors.textSecondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{
                    color: colors.background,
                    fontSize: 14,
                    fontWeight: '800',
                  }}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: colors.text,
                }}>
                  {player.name}
                  {player.name === playerName && ' (Vous)'}
                </Text>
              </View>
              
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.primary,
              }}>
                {Math.round(player.score || 0)} pts
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
