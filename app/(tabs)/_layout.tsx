import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Start',
          href: '/',
        }}
      />
      <Tabs.Screen
        name="character-select"
        options={{
          title: 'Character Selection',
          href: null,
        }}
      />
      <Tabs.Screen
        name="battle"
        options={{
          title: 'Battle',
          href: null,
        }}
      />
    </Tabs>
  );
}