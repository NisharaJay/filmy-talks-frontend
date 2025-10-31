import { Image, StyleSheet } from 'react-native';
import { SIZES } from '../constants/theme';

export default function Logo() {
  return <Image source={require('../assets/logo.png')} style={styles.logo} />;
}

const styles = StyleSheet.create({
  logo: {
    width: SIZES.image.banner.height * 1.5,
    height: SIZES.image.banner.height,
    resizeMode: 'contain',
    marginBottom: SIZES.spacing.lg,
  },
});