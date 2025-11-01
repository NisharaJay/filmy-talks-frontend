import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { SIZES } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo />
        <Text style={styles.title}>Welcome to Filmy Talks!</Text>
        <Text style={styles.description}>
          Discover the latest movie news, reviews, and Sri Lankan cinema trends!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Get Started" onPress={() => router.push('/login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.spacing.lg },
  title: { fontSize: 32, fontWeight: '700', color: '#211e1f', textAlign: 'center' },
  description: { textAlign: 'center', color: '#4a4949ff', fontSize: 17, lineHeight: 24, padding: SIZES.spacing.lg },
  buttonContainer: { padding: SIZES.spacing.lg + 15, paddingBottom: SIZES.spacing.xl + 20 },
});