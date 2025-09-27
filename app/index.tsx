
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
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
        <View style={{ alignItems: 'center', marginBottom: 50 }}>
          <Text style={commonStyles.title}>Conquête de Territoires</Text>
          <Text style={commonStyles.textSecondary}>
            Jeu de combat tour par tour multijoueur
          </Text>
        </View>

        {/* Game Preview */}
        <View style={[commonStyles.gameCard, { marginBottom: 40 }]}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            marginBottom: 20,
          }}>
            {Array.from({ length: 16 }, (_, i) => (
              <View
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: i < 6 ? colors.danger : 
                                  i < 10 ? colors.primary : 
                                  i < 12 ? colors.success : colors.backgroundAlt,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            ))}
          </View>
          
          <Text style={[commonStyles.subtitle, { fontSize: 18, marginBottom: 8 }]}>
            🏰 Conquérez le plus de territoires !
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
            Affrontez vos amis dans des combats de réflexes pour contrôler la carte
          </Text>
        </View>

        {/* Game Features */}
        <View style={[commonStyles.card, { marginBottom: 30 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="people" size={24} color={colors.primary} />
            <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '500', color: colors.text }}>
              Multijoueur jusqu&apos;à 4 joueurs
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="flash" size={24} color={colors.accent} />
            <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '500', color: colors.text }}>
              Combats de réflexes en temps réel
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="map" size={24} color={colors.success} />
            <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '500', color: colors.text }}>
              Stratégie de conquête territoriale
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="trophy" size={24} color={colors.danger} />
            <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '500', color: colors.text }}>
              Victoire par domination
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { width: '100%' }]}
            onPress={handleCreateGame}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="add-circle" size={24} color={colors.background} />
              <Text style={{
                color: colors.background,
                fontSize: 18,
                fontWeight: '600',
                marginLeft: 8,
              }}>
                Créer une partie
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%' }]}
            onPress={handleJoinGame}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="enter" size={24} color={colors.text} />
              <Text style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: '600',
                marginLeft: 8,
              }}>
                Rejoindre une partie
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%', backgroundColor: 'transparent' }]}
            onPress={handleHowToPlay}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="help-circle" size={24} color={colors.primary} />
              <Text style={{
                color: colors.primary,
                fontSize: 16,
                fontWeight: '500',
                marginLeft: 8,
              }}>
                Comment jouer ?
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            🎮 Jeu de stratégie multijoueur
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
