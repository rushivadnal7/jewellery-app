import { StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '@/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const TabIcon = ({ title, focused, icon }: { title: string; focused: boolean; icon: string }) => {
  return (
    <View style={focused ? styles.focustabContainer : styles.tabContainer}>
      <MaterialIcons
        name={icon as any}
        size={24}
        color={focused ? colors.primary : "gray"}
      />
      {focused && (
        <Text style={{
          color: colors.primary,
          marginLeft: 8,
          fontSize: 14,
          fontWeight: '600'
        }}>
          {title}
        </Text>
      )}
    </View>
  );
};

const _layout = () => {
  return (
    // <SafeAreaView  style={styles.safeArea}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderRadius: 30,
          marginHorizontal: 20,
          marginBottom: 45,
          height: 60,
          position: 'absolute',
          overflow: 'hidden',
          borderColor: '#fff',
          borderWidth: 0,
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center'
        },
        tabBarItemStyle: {
          height: 60,
          padding: 0,
          margin: 0,
        }
      }}>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon title="Home" focused={focused} icon="home" />
            )
          }}
        />
        <Tabs.Screen
          name='posts'
          options={{
            title: 'Posts',
            tabBarIcon: ({ focused }) => (
              <TabIcon title="Posts" focused={focused} icon="article" />
            )
          }}
        />
        <Tabs.Screen
          name='logout'
          options={{
            title: 'logout',
            tabBarIcon: ({ focused }) => (
              <TabIcon title="Logout" focused={focused} icon="logout" />
            )
          }}
        />
      </Tabs>
    // </SafeAreaView>
  )
}

export default _layout

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#fff'
  },
  focustabContainer: {
    flexDirection: 'row',
    // backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    minWidth: 120,
    minHeight: 68,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginTop: 18
  },
  tabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    minWidth: 80,
    minHeight: 60,
    paddingHorizontal: 20,
    marginTop: 18
  }
})