import { View, StyleSheet, Image } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';


export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/appmenu' as any);
    }, 1800);

    return () => clearTimeout(timer);
  }, [router]);


  return (
    <View style={styles.container}>
      <Image
      source={require('../assets/images/kuravote.png')}
      style={styles.logo}
      resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#264062',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
