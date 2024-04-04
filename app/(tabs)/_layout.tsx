import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddRecipeIcon from '@/assets/icons/icon_add_recipe.svg';
import ChatIcon from '@/assets/icons/icon_chat.svg';
import ChatIconActive from '@/assets/icons/icon_chat_active.svg';
import HomeIconActive from '@/assets/icons/icon_home_active.svg';
import HomeIconInactive from '@/assets/icons/icon_home_inactive.svg';
import SavedIconActive from '@/assets/icons/icon_saved_active.svg';
import SavedIconInactive from '@/assets/icons/icon_saved_inactive.svg';
import UserIconActive from '@/assets/icons/icon_user_active.svg';
import UserIconInactive from '@/assets/icons/icon_user_inactive.svg';
import TabBarBackground from '@/assets/images/TabBarBackground.svg';
import { colors } from '@/assets/theme/AppTheme';
import UserProfileModal from '@/components/molecules/UserProfileModal';
import { Screens } from '@/enums/screens';

const TabsLayout = () => {
  return (
    <>
      <UserProfileModal />
      <SafeAreaView style={styles.safeArea}>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: styles.stockTabBar,
            tabBarBackground: () => (
              <TabBarBackground
                preserveAspectRatio="xMidYMin slice"
                width={'100%'}
                height={72}
                style={styles.TabBarBackground}
              />
            )
          }}
        >
          <Tabs.Screen
            name={Screens.Home}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (focused ? <HomeIconActive /> : <HomeIconInactive />)
            }}
          />
          <Tabs.Screen
            name={Screens.SavedRecipes}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (focused ? <SavedIconActive /> : <SavedIconInactive />)
            }}
          />
          <Tabs.Screen
            name={Screens.AddRecipe}
            options={{
              unmountOnBlur: true,
              tabBarIcon: () => <AddRecipeIcon style={styles.addRecipeIcon} />,
              tabBarStyle: styles.hiddenTab
            }}
          />
          <Tabs.Screen
            name={Screens.GenerateRecipe}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (focused ? <ChatIconActive /> : <ChatIcon />)
            }}
          />
          <Tabs.Screen
            name={Screens.UserAccount}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (focused ? <UserIconActive /> : <UserIconInactive />)
            }}
          />
        </Tabs>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  stockTabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    borderColor: colors.transparent,
    bottom: 0,
    height: 72,
    width: '100%',
    left: 0,
    backgroundColor: colors.transparent,
    paddingTop: Platform.OS === 'ios' ? 24 : 0
  },
  hiddenTab: {
    transform: [{ translateY: 150 }], //hack - display: none breaks header
    position: 'absolute'
  },
  addRecipeIcon: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 12
  },
  TabBarBackground: {
    backgroundColor: Platform.OS === 'android' ? colors.white : colors.transparent,
    shadowRadius: 5,
    shadowOpacity: 0.03,
    shadowOffset: {
      width: 0,
      height: -10
    },
    position: 'absolute',
    bottom: 0
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white
  }
});

export default TabsLayout;
