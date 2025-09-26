
import React from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';

export default function HowToPlayScreen() {
  console.log('HowToPlayScreen rendered');

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

      <ScrollView contentContainerStyle={[commonStyles.content, { justifyContent: 'flex-start' }]}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Icon name="help-circle" size={60} color={colors.primary} />
          <Text style={commonStyles.title}>Comment jouer ?</Text>
          <Text style={commonStyles.textSecondary}>
            Apprenez les règles du jeu de réaction
          </Text>
        </View>

        <View style={commonStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="people" size={24} color={colors.primary} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Multijoueur
            </Text>
          </View>
          <Text style={commonStyles.text}>
            • Jouez avec 2 à 4 joueurs{'\n'}
            • Un joueur crée la partie et partage le code{'\n'}
            • Les autres rejoignent avec ce code{'\n'}
            • Tous les joueurs doivent être prêts pour commencer
          </Text>
        </View>

        <View style={commonStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="flash" size={24} color={colors.accent} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Règles du jeu
            </Text>
          </View>
          <Text style={commonStyles.text}>
            • Le jeu se déroule en 3 manches{'\n'}
            • Attendez que le bouton devienne vert{'\n'}
            • Appuyez le plus rapidement possible{'\n'}
            • Plus vous êtes rapide, plus vous gagnez de points{'\n'}
            • Le joueur avec le plus de points gagne !
          </Text>
        </View>

        <View style={commonStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="trophy" size={24} color={colors.success} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Système de points
            </Text>
          </View>
          <Text style={commonStyles.text}>
            • Temps de réaction parfait (0ms) = 1000 points{'\n'}
            • Chaque milliseconde enlève 1 point{'\n'}
            • Temps de réaction de 200ms = 800 points{'\n'}
            • Temps de réaction de 500ms = 500 points{'\n'}
            • Plus de 1000ms = 0 point
          </Text>
        </View>

        <View style={commonStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="bulb" size={24} color={colors.accent} />
            <Text style={[commonStyles.subtitle, { marginLeft: 12, marginBottom: 0 }]}>
              Conseils
            </Text>
          </View>
          <Text style={commonStyles.text}>
            • Restez concentré et prêt{'\n'}
            • Ne cliquez pas trop tôt (bouton rouge){'\n'}
            • Entraînez-vous pour améliorer vos réflexes{'\n'}
            • Amusez-vous avec vos amis !
          </Text>
        </View>

        <View style={commonStyles.buttonContainer}>
          <TouchableOpacity
            style={[buttonStyles.primary, { width: '100%' }]}
            onPress={handleBack}
          >
            <Text style={{
              color: colors.background,
              fontSize: 18,
              fontWeight: '600',
            }}>
              Compris ! Commencer à jouer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
