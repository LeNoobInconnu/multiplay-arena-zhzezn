
import React from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { router } from 'expo-router';
import Icon from '../components/Icon';

export default function HowToPlayScreen() {
  console.log('HowToPlayScreen rendered');

  const handleBack = () => {
    console.log('Back pressed');
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={handleBack}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Icon name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, fontSize: 16, color: colors.primary }}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[commonStyles.content, { paddingTop: 0 }]}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Text style={commonStyles.title}>Comment Jouer</Text>
          <Text style={commonStyles.textSecondary}>
            Guide complet du jeu Conquête de Territoires
          </Text>
        </View>

        {/* Game Overview */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="flag" size={28} color={colors.primary} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Objectif du Jeu
            </Text>
          </View>
          
          <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 12 }]}>
            Le but est de <Text style={{ fontWeight: '600', color: colors.primary }}>conquérir le plus de territoires</Text> possible sur la carte. Le premier joueur à contrôler plus de la moitié des territoires remporte la partie !
          </Text>
          
          <View style={{
            backgroundColor: colors.backgroundAlt,
            padding: 16,
            borderRadius: 12,
            marginTop: 8,
          }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontWeight: '500' }]}>
              🏆 Victoire : Plus de 18 territoires sur 36
            </Text>
          </View>
        </View>

        {/* Game Setup */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="people" size={28} color={colors.success} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Configuration
            </Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 4 }]}>
              • 2 à 4 joueurs
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              Chaque joueur a une couleur unique
            </Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 4 }]}>
              • Carte de 36 territoires (6x6)
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              Tous les territoires commencent neutres
            </Text>
          </View>
          
          <View>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 4 }]}>
              • Jeu au tour par tour
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              Les joueurs alternent leurs actions
            </Text>
          </View>
        </View>

        {/* Gameplay */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="game-controller" size={28} color={colors.accent} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Déroulement du Jeu
            </Text>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 8, color: colors.success }]}>
              1. Conquête de territoire vide
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14, marginBottom: 4 }]}>
              • Cliquez sur un territoire gris (neutre)
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              • Il devient instantanément vôtre
            </Text>
          </View>
          
          <View>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 8, color: colors.danger }]}>
              2. Attaque d&apos;un territoire ennemi
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14, marginBottom: 4 }]}>
              • Cliquez sur un territoire d&apos;une autre couleur
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              • Déclenche un combat de réflexes
            </Text>
          </View>
        </View>

        {/* Combat System */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="flash" size={28} color={colors.danger} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Système de Combat
            </Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 4 }]}>
              Phase 1 : Préparation
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              Compte à rebours de 3 secondes
            </Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 4 }]}>
              Phase 2 : Attente
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              Le bouton rouge indique &quot;Attendez...&quot;
            </Text>
          </View>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={[commonStyles.text, { textAlign: 'left', fontWeight: '600', marginBottom: 4 }]}>
              Phase 3 : Action !
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              Le bouton devient vert - Appuyez le plus vite possible !
            </Text>
          </View>
          
          <View style={{
            backgroundColor: colors.success + '20',
            padding: 12,
            borderRadius: 8,
            marginTop: 8,
          }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontWeight: '500', color: colors.success }]}>
              ⚡ Le joueur le plus rapide remporte le territoire !
            </Text>
          </View>
        </View>

        {/* Strategy Tips */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="bulb" size={28} color={colors.accent} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Conseils Stratégiques
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              🎯 <Text style={{ fontWeight: '600' }}>Commencez par les territoires vides</Text> - Conquête garantie sans combat
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              ⚔️ <Text style={{ fontWeight: '600' }}>Attaquez stratégiquement</Text> - Ne combattez que si nécessaire
            </Text>
          </View>
          
          <View style={{ marginBottom: 8 }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              🏃 <Text style={{ fontWeight: '600' }}>Entraînez vos réflexes</Text> - La vitesse détermine la victoire
            </Text>
          </View>
          
          <View>
            <Text style={[commonStyles.textSecondary, { textAlign: 'left', fontSize: 14 }]}>
              🗺️ <Text style={{ fontWeight: '600' }}>Contrôlez le centre</Text> - Position stratégique sur la carte
            </Text>
          </View>
        </View>

        {/* Victory Conditions */}
        <View style={[commonStyles.card, { marginBottom: 30 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="trophy" size={28} color={colors.accent} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Conditions de Victoire
            </Text>
          </View>
          
          <Text style={[commonStyles.text, { textAlign: 'left', marginBottom: 12 }]}>
            La partie se termine dès qu&apos;un joueur contrôle <Text style={{ fontWeight: '600', color: colors.primary }}>plus de 18 territoires</Text> (soit plus de 50% de la carte).
          </Text>
          
          <View style={{
            backgroundColor: colors.accent + '20',
            padding: 16,
            borderRadius: 12,
          }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontWeight: '600', color: colors.accent }]}>
              🏆 Premier à 19 territoires = Victoire !
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, { width: '100%' }]}
          onPress={handleBack}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="checkmark-circle" size={20} color={colors.background} />
            <Text style={{
              color: colors.background,
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}>
              Compris, allons jouer !
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
