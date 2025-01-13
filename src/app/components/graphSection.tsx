/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { authenticatedPost } from '../../1up/utils/api';
import { calculateDateRange } from '../../1up/utils/dateRangeCalculate';
import { PerformanceSelections } from '../types/performanceApiBody';
import { themes } from '../../1up/theme/theme';
import { GlobalNavigationProp } from '../../../App';
import { useNavigation } from '@react-navigation/core';

const { width } = Dimensions.get('window');

interface Props {
  code: string;
  ticker: string;
  list?: any;
  hideDynamicAxis?: boolean;
}

export const GraphSection = ({ code, ticker, list, hideDynamicAxis }: Props) => {
  const [performanceData, setPerformanceData] = useState<any>([]);
  const [activeTab, setActiveTab] = useState('max');
  const [percentageChange, setPercentageChange] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<GlobalNavigationProp>();
  const [since, setSince] = useState<string | any>('max');

  const performanceApi = async (label: string, value: number) => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = calculateDateRange(label);

      const requestBody = {
        code: `${ticker}_${code}`,
        dateRange: {
          startDate,
          endDate,
        },
        difference: value,
        tickerUpsideList: list,
      };

      const res = await authenticatedPost(
        'webV1/pages/strategyManegement/strategyInsight/dashboard/performance',
        requestBody,
      );

      if (res.data) {
        setPerformanceData(res.data);
        setSince(res?.data?.since);
        // Calculate percentage change
        const firstValue = res.data[0]?.nav || 0;
        const lastValue = res.data[res.data.length - 1]?.nav || 0;
        setPercentageChange(((lastValue - firstValue) / firstValue) * 100);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transformDataForChart = (apiData: any[]) => {
    return apiData.map(item => ({
      value: item.nav,
      label: new Date(item.date.value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));
  };

  useEffect(() => {
    performanceApi(
      activeTab,
      PerformanceSelections.find(p => p.label === activeTab)?.value || 180,
    );
  }, [activeTab]);

  useEffect(() => {
    const defaultSelection = PerformanceSelections.find(
      p => p.label === 'max',
    ) || {
      label: 'max',
      value: 0,
    };
    performanceApi(defaultSelection.label, defaultSelection.value);
  }, []);

  const handleLinkPress = () => {
    navigation.navigate('LegalDocumentsWebview', {
      url: 'http://3.143.18.32/pdfs/From%20ADV%20Part%202A.pdf',
      name: 'OneUp Form ADV Part 2A',
    });
  };

  return (
    <View style={styles.container}>
      {/* Percentage Change */}
      <Text style={[
        styles.percentageChange,
        { color: percentageChange >= 0 ? '#20D49B' : '#FF4B4B' }
      ]}>
        {percentageChange >= 0 ? '+' : ''}
        {percentageChange.toFixed(2)}%
      </Text>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4253F0" />
        ) : performanceData.length ? (
          <View style={{ width: width - 30, height: 200, transform: [{ scale: 1.1 }] }}>
            <LineChart
              areaChart
              isAnimated
              data={transformDataForChart(performanceData)}
              hideDataPoints
              hideYAxisText
              spacing={width * 0.8 / performanceData.length}
              hideAxesAndRules
              color="#4253F0"
              thickness={2}
              startFillColor="#4253F0"
              endFillColor="rgba(0, 0, 0, 0)"
              startOpacity={0.8}
              endOpacity={0.1}
              noOfSections={4}
            // width={width - 32}
            // maxValue={Math.max(...performanceData.map((item: any) => item.nav)) * 1.1}
            // minValue={Math.min(...performanceData.map(item => item.nav)) * 0.9}
            />
          </View>
        ) : (
          <Text style={styles.loadingText}>No data available</Text>
        )}
      </View>

      {/* Time Period Tabs */}
      {!hideDynamicAxis &&
        <View style={styles.tabsContainer}>
          {PerformanceSelections.map(period => (
            <TouchableOpacity
              key={period.label}
              style={[
                styles.tab,
                activeTab === period.label && styles.activeTab,
                isLoading && styles.disabledTab,
              ]}
              disabled={isLoading}
              onPress={() => setActiveTab(period.label)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === period.label && styles.activeTabText,
                  isLoading && styles.disabledTabText,
                ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      }

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        *This simulated historical performance is based on your preferences and
        does not guarantee future results.
      </Text>

      {/* Risk Information */}
      <Text style={styles.riskTitle}>RISK</Text>
      <Text style={styles.riskText}>
        This portfolio is suitable for investors with a moderate to aggressive
        risk tolerance; however, market conditions play a significant role in a
        stock's daily movement.
      </Text>

      <Text style={styles.riskTextLink}>
        For more information on the portfolio, view{' '}
        <Text
          style={{ textDecorationLine: 'underline' }}
          onPress={handleLinkPress}>
          OneUp Form ADV Part 2A
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  percentageChange: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  tab: {
    padding: 8,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: '#4253F0',
  },
  disabledTab: {
    opacity: 0.5,
  },
  tabText: {
    color: 'white',
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledTabText: {
    opacity: 0.5,
  },
  disclaimer: {
    color: '#6A6A6A',
    fontSize: 10,
    fontFamily: themes.fonts.fontFamily,
    marginTop: 16,
  },
  riskTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
  },
  riskText: {
    color: '#6A6A6A',
    fontSize: 10,
    fontFamily: themes.fonts.fontFamily,
    marginTop: 8,
  },
  riskTextLink: {
    color: '#6A6A6A',
    fontSize: 10,
    fontFamily: themes.fonts.fontFamily,
    marginTop: 16,
    marginBottom: 24,
  },
});