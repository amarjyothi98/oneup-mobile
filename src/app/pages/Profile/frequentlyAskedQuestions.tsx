import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions, Platform} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {themes} from '../../../1up/theme/theme';
import {HeaderComponent} from '../../components/header';
import {Icon} from 'react-native-paper';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {faqData} from '../../types/faq';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

export const FrequentlyAskedQuestions = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleExpand = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <LinearGradient
      colors={['#4253F0', '#2A1452', '#111928']}
      locations={[0.0164, 0.2446, 0.3717]}
      start={{x: 0.7, y: 0}}
      end={{x: 0.4, y: 0.8}}
      style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <HeaderComponent title="Help Center" />
        </View>

        <View style={styles.topContainer}>
          <Text style={styles.topText}>Frequently Asked Questions</Text>
        </View>

        {/* FAQ List */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {faqData.map((item, index) => {
            const isExpanded = activeIndex === index;
            return (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => toggleExpand(index)}>
                <View
                  style={[
                    styles.collapsibleContainer,
                    isExpanded && styles.expandedContainer,
                  ]}>
                  <View style={styles.questionContainer}>
                    <Text
                      style={[
                        styles.questionText,
                        {
                          color: isExpanded
                            ? themes.colors.white
                            : themes.colors.neutralN500,
                        },
                      ]}>
                      {item.question}
                    </Text>
                    <Icon
                      source={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={
                        isExpanded
                          ? themes.colors.white
                          : themes.colors.neutralN500
                      }
                    />
                  </View>
                  <Collapsible collapsed={!isExpanded}>
                    <View style={styles.answerContainer}>
                      <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                  </Collapsible>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.SecondaryMain,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.40)',
  },
  contentContainer: {
    paddingHorizontal: 14,
  },
  topContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    color: themes.colors.white,
    fontFamily: themes.fonts.fontFamily,
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  collapsibleContainer: {
    borderWidth: 1,
    borderColor: themes.colors.SecondaryMain,
    borderRadius: 5,
    marginBottom: 10,
  },
  expandedContainer: {
    borderColor: themes.colors.SecondaryMain,
  },
  questionContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: themes.colors.primaryMain,
  },
  questionText: {
    width: width * 0.82,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : 'semibold',
    fontFamily: themes.fonts.fontFamily,
  },
  answerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: themes.colors.SecondaryMain,
  },
  answerText: {
    color: themes.colors.neutralN500,
    fontSize: 14.5,
    fontWeight: Platform.OS === 'ios' ? '400' : 'regular',
    fontFamily: themes.fonts.fontFamily,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});
