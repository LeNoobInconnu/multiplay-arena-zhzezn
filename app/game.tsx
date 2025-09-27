
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
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
  territories?: number;
  color: string;
}

interface Territory {
  id: number;
  owner: string | null;
  x: number;
  y: number;
  isUnderAttack?: boolean;
  attackingPlayer?: string;
}

interface GameState {
  phase: 'setup' | 'playing' | 'combat' | 'finished';
  currentPlayer: number;
  turn: number;
  selectedTerritory: number | null;
  combatTerritory: number | null;
  combatPhase: 'waiting' | 'ready' | 'go' | 'result';
}

const GRID_SIZE = 6;
const TOTAL_TERRITORIES = GRID_SIZE * GRID_SIZE;
const { width: screenWidth } = Dimensions.get('window');
const TERRITORY_SIZE = Math.min((screenWidth - 60) / GRID_SIZE, 50);

export default function TerritoryGameScreen() {
  const params = useLocalSearchParams();
  const { gameCode, playerName, players: playersParam } = params;
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    currentPlayer: 0,
    turn: 1,
    selectedTerritory: null,
    combatTerritory: null,
    combatPhase: 'waiting',
  });
  const [combatStartTime, setCombatStartTime] = useState<number>(0);
  const [playerReacted, setPlayerReacted] = useState(false);
  const [combatCountdown, setCombatCountdown] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const playerColors = ['#FF3B30', '#007AFF', '#34C759', '#FF9500'];

  console.log('TerritoryGameScreen rendered with params:', params);

  // Initialize game
  useEffect(() => {
    if (playersParam && typeof playersParam === 'string') {
      try {
        const parsedPlayers = JSON.parse(playersParam);
        const playersWithColors = parsedPlayers.map((player: Player, index: number) => ({
          ...player,
          score: 0,
          territories: 0,
          color: playerColors[index % playerColors.length],
        }));
        setPlayers(playersWithColors);
        
        // Initialize territories
        const initialTerritories: Territory[] = [];
        for (let i = 0; i < TOTAL_TERRITORIES; i++) {
          initialTerritories.push({
            id: i,
            owner: null,
            x: i % GRID_SIZE,
            y: Math.floor(i / GRID_SIZE),
          });
        }
        setTerritories(initialTerritories);
        setGameState(prev => ({ ...prev, phase: 'playing' }));
      } catch (error) {
        console.log('Error parsing players:', error);
      }
    }
  }, [playersParam]);

  // Combat countdown effect
  useEffect(() => {
    if (gameState.combatPhase === 'waiting') {
      setCombatCountdown(3);
      const countdownInterval = setInterval(() => {
        setCombatCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setGameState(prev => ({ ...prev, combatPhase: 'ready' }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [gameState.combatPhase]);

  // Combat ready to go effect
  useEffect(() => {
    if (gameState.combatPhase === 'ready') {
      const randomDelay = Math.random() * 3000 + 2000;
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, combatPhase: 'go' }));
        setCombatStartTime(Date.now());
        setPlayerReacted(false);
        
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
  }, [gameState.combatPhase, scaleAnim, colorAnim]);

  const handleTerritoryPress = (territoryId: number) => {
    if (gameState.phase !== 'playing') return;
    
    const territory = territories[territoryId];
    const currentPlayer = players[gameState.currentPlayer];
    
    console.log('Territory pressed:', territoryId, 'by player:', currentPlayer.name);

    if (!territory.owner) {
      // Claim empty territory
      claimTerritory(territoryId, currentPlayer.id);
    } else if (territory.owner !== currentPlayer.id) {
      // Attack enemy territory
      startCombat(territoryId);
    }
  };

  const claimTerritory = (territoryId: number, playerId: string) => {
    setTerritories(prev => prev.map(t => 
      t.id === territoryId ? { ...t, owner: playerId } : t
    ));
    
    updatePlayerTerritories();
    nextTurn();
  };

  const startCombat = (territoryId: number) => {
    console.log('Starting combat for territory:', territoryId);
    setGameState(prev => ({ 
      ...prev, 
      phase: 'combat', 
      combatTerritory: territoryId,
      combatPhase: 'waiting'
    }));
    
    setTerritories(prev => prev.map(t => 
      t.id === territoryId 
        ? { ...t, isUnderAttack: true, attackingPlayer: players[gameState.currentPlayer].id }
        : t
    ));
  };

  const handleCombatReaction = () => {
    if (gameState.combatPhase !== 'go' || playerReacted) return;

    const reactionTime = Date.now() - combatStartTime;
    setPlayerReacted(true);
    
    console.log('Combat reaction time:', reactionTime, 'ms');

    // Determine combat winner (player vs simulated opponent)
    const opponentTime = Math.random() * 800 + 200;
    const playerWins = reactionTime < opponentTime;
    
    setTimeout(() => {
      if (playerWins && gameState.combatTerritory !== null) {
        // Player wins - capture territory
        setTerritories(prev => prev.map(t => 
          t.id === gameState.combatTerritory 
            ? { ...t, owner: players[gameState.currentPlayer].id, isUnderAttack: false }
            : t
        ));
      } else {
        // Player loses - remove attack marker
        setTerritories(prev => prev.map(t => 
          t.id === gameState.combatTerritory 
            ? { ...t, isUnderAttack: false }
            : t
        ));
      }
      
      setGameState(prev => ({ 
        ...prev, 
        phase: 'playing',
        combatTerritory: null,
        combatPhase: 'waiting'
      }));
      
      // Reset animations
      scaleAnim.setValue(1);
      colorAnim.setValue(0);
      
      updatePlayerTerritories();
      nextTurn();
    }, 2000);

    setGameState(prev => ({ ...prev, combatPhase: 'result' }));
  };

  const updatePlayerTerritories = () => {
    setPlayers(prev => prev.map(player => ({
      ...player,
      territories: territories.filter(t => t.owner === player.id).length,
      score: territories.filter(t => t.owner === player.id).length * 10,
    })));
  };

  const nextTurn = () => {
    const nextPlayerIndex = (gameState.currentPlayer + 1) % players.length;
    const newTurn = nextPlayerIndex === 0 ? gameState.turn + 1 : gameState.turn;
    
    // Check win condition
    const playerTerritories = territories.filter(t => t.owner === players[gameState.currentPlayer].id).length;
    if (playerTerritories > TOTAL_TERRITORIES / 2) {
      setGameState(prev => ({ ...prev, phase: 'finished' }));
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      currentPlayer: nextPlayerIndex,
      turn: newTurn,
    }));
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

  const getTerritoryColor = (territory: Territory) => {
    if (territory.isUnderAttack) {
      return colors.danger;
    }
    if (territory.owner) {
      const owner = players.find(p => p.id === territory.owner);
      return owner?.color || colors.textSecondary;
    }
    return colors.backgroundAlt;
  };

  const getCombatButtonText = () => {
    switch (gameState.combatPhase) {
      case 'waiting':
        return combatCountdown > 0 ? combatCountdown.toString() : 'Préparez-vous...';
      case 'ready':
        return 'Attendez...';
      case 'go':
        return playerReacted ? 'Réagi !' : 'APPUYEZ !';
      case 'result':
        return 'Combat terminé';
      default:
        return '';
    }
  };

  const currentPlayer = players[gameState.currentPlayer];
  const isCurrentPlayer = currentPlayer?.name === playerName;

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
            Tour {gameState.turn}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={commonStyles.content}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={commonStyles.title}>Conquête de Territoires</Text>
          {gameState.phase === 'playing' && (
            <Text style={[commonStyles.textSecondary, { 
              color: isCurrentPlayer ? colors.primary : colors.textSecondary,
              fontWeight: isCurrentPlayer ? '600' : '400'
            }]}>
              {isCurrentPlayer ? 'Votre tour !' : `Tour de ${currentPlayer?.name}`}
            </Text>
          )}
        </View>

        {gameState.phase === 'combat' && (
          <View style={[commonStyles.gameCard, { minHeight: 300, justifyContent: 'center', marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
              Combat en cours !
            </Text>
            
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={[
                  {
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: gameState.combatPhase === 'go' ? colors.success : 
                                   gameState.combatPhase === 'ready' ? colors.danger : colors.primary,
                  }
                ]}
                onPress={handleCombatReaction}
                disabled={gameState.combatPhase !== 'go' || playerReacted}
              >
                <Text style={{
                  color: colors.background,
                  fontSize: 24,
                  fontWeight: '800',
                  textAlign: 'center',
                }}>
                  {getCombatButtonText()}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {gameState.phase === 'finished' && (
          <View style={[commonStyles.gameCard, { marginBottom: 20 }]}>
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

        {/* Territory Grid */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Carte des Territoires
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
          }}>
            {territories.map((territory) => (
              <TouchableOpacity
                key={territory.id}
                style={{
                  width: TERRITORY_SIZE,
                  height: TERRITORY_SIZE,
                  backgroundColor: getTerritoryColor(territory),
                  borderRadius: 8,
                  borderWidth: territory.isUnderAttack ? 3 : 1,
                  borderColor: territory.isUnderAttack ? colors.danger : colors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleTerritoryPress(territory.id)}
                disabled={gameState.phase !== 'playing' || !isCurrentPlayer}
              >
                {territory.owner && (
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.background,
                  }} />
                )}
                {territory.isUnderAttack && (
                  <Icon name="flash" size={16} color={colors.background} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Player Stats */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Classement
          </Text>
          
          {players
            .sort((a, b) => (b.territories || 0) - (a.territories || 0))
            .map((player, index) => (
            <View key={player.id} style={[
              commonStyles.playerCard,
              player.name === playerName && { backgroundColor: colors.primary + '20' }
            ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: player.color,
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
                  {player.name === currentPlayer?.name && ' 👑'}
                </Text>
              </View>
              
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.primary,
              }}>
                {player.territories || 0} territoires
              </Text>
            </View>
          ))}
        </View>

        {gameState.phase === 'playing' && (
          <View style={[commonStyles.card, { marginTop: 16 }]}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              💡 Cliquez sur un territoire vide pour le conquérir, ou sur un territoire ennemi pour l&apos;attaquer !
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
