import { useEffect, useState } from "react";
import { SplashScreen, Stack, useRouter } from "expo-router";
import * as Keychain from "react-native-keychain";
import { Image, View } from "react-native";
import LoginScreen from "../login";
import HomeScreen from "../home";

const Home = () => {
  const router = useRouter();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  SplashScreen.preventAutoHideAsync();

  async function getToken() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving token", error);
      return null;
    }
  }
  function LogoTitle() {
    return (
      <Image
        style={{ width: 100, height: 50, marginRight: 10 }}
        source={require("../../assets/images/logo.png")}
      />
    );
  }

  useEffect(() => {
    if (userToken) {
      SplashScreen.hideAsync();
      setIsLoading(false);
      console.log("TOKEN: ", userToken);
    }
  }, [userToken]);

  const bootstrapAsync = async () => {
    try {
      const token = await getToken();
      setUserToken(token);
    } catch (error) {
      console.error("Error during token bootstrap", error);
      setUserToken(null);
    }
  };

  useEffect(() => {
    bootstrapAsync();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerRight: (props) => <LogoTitle />,

          headerTransparent: true,
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#ffffff",
        }}
      />
      {userToken ? <HomeScreen /> : <LoginScreen />}
    </View>
  );
};

export default Home;
