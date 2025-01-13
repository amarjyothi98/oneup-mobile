import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Store {
  async get(key: string) {
    try {
      const result = await AsyncStorage.getItem(key);
      return result ? JSON.parse(result) : null;
    } catch (error) {
      throw error;
    }
  }

  async save(key: string, value: any) {
    try {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw error;
    }
  }

  async remove(key: string) {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  }

  async clear() {
    try {
      return await AsyncStorage.clear();
    } catch (error) {
      throw error;
    }
  }
}
