import { FeatureLike } from "ol/Feature";
import { Pollutant, PollutantLegend, MapDataType } from "../types";

const colorScale: string[] = [
  "#edf8fb",
  "#bfd3e6",
  "#9ebcda",
  "#8c96c6",
  "#8c6bb1",
  "#88419d",
  "#6e016b"
];

/**
 * Simple in-memory cache for storing breakpoints in order to avoid calculating them again for
 * previously viewed pollutant layers.
 */
const breakPointCache: Map<string, number[]> = new Map();

/**
 * Returns style identifier for the breakPointCache.
 */
const getStyleId = (dataType: MapDataType, valuePropName: string) => dataType + valuePropName;

const getStandardDeviation = (array: number[], mean: number, n: number): number => {
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

/**
 * Rounds the given value one or more significant figures.
 */
const roundBreakPoint = (n: number, sigNumbers = 1): number => {
  return parseFloat(n.toPrecision(sigNumbers));
};

/**
 * Calculates breakpoints by a given value array (valueList) and number of classes (classCount).
 * Breakpoints are calculated as quantiles when no outliers are detected in the value array. However,
 * if one or more outliers are present in the value array, the final set of breakpoints is combined
 * from both quantiles and outlier-adjusted breakpoints. Outliers are detected by z-scores 1 & 3 and
 * respective values (if found) are used as adjusted breakpoints for the last 1-2 classes.
 */
const calculateAdjustedBreakPoints = (valueList: number[], classCount: number): number[] => {
  const n = valueList.length;
  const mean = valueList.reduce((a, b) => a + b) / n;
  const std = getStandardDeviation(valueList, mean, n);
  const zList = valueList.map((value) => (value - mean) / std);

  // calculate 0-2 adjusted breakpoints for classifying outliers, detect outliers by z-scores (1 & 3)
  let firstOutlierBpIndex = valueList[n - 1];
  const outlierBreakPoints: number[] = [];
  if (valueList.length > 30) {
    for (let i = 0; i < n; i++) {
      if (zList[i] > 1) {
        if (outlierBreakPoints.length === 0) {
          firstOutlierBpIndex = i - 1;
          outlierBreakPoints.push(roundBreakPoint(valueList[i]));
        }
        if (zList[i] > 3) {
          outlierBreakPoints.push(roundBreakPoint(valueList[i]));
          break;
        }
      }
    }
  }

  // calculate normal breakpoints that will be set before the outlier-breakpoints
  const normalClassCount = classCount - outlierBreakPoints.length;
  const normalClassSize = Math.round(firstOutlierBpIndex / normalClassCount);
  const breakPoints: number[] = [];
  for (let i = 0; i < normalClassCount - 1; i++) {
    const bp = valueList[normalClassSize + normalClassSize * i];
    breakPoints[i] = roundBreakPoint(bp);
  }

  // combine final breakpoints array from normal breakpoints, outlier-adjusted breakpoints (if any)
  // and highest value
  const combinedBreakPoints = breakPoints.concat(outlierBreakPoints, [valueList[n - 1]]);
  // filter out duplicate breakpoints (if present)
  return combinedBreakPoints.filter(
    (value, index, self) => self.indexOf(value) === index && value > 0
  );
};

export const getBreakPoints = (
  dataType: MapDataType,
  valuePropName: string
): number[] | undefined => {
  const styleId = getStyleId(dataType, valuePropName);
  if (breakPointCache.has(styleId)) {
    return [...breakPointCache.get(styleId)!];
  }
  return undefined;
};

/**
 * Returns true if breakpoints for the given datatype and feature property were calculated previously and can
 * hence be found from the cache.
 */
export const hasBreakPoints = (dataType: MapDataType, valuePropName: string): boolean => {
  return breakPointCache.has(getStyleId(dataType, valuePropName));
};

/**
 * Calculates outlier-adjusted breakpoints by the given value array and stores the result in the in-memory cache
 * for easy reuse. Filters out null and undefined values from the value array.
 */
export const getPollutantBreakPoints = (
  dataType: MapDataType,
  pollutantId: string,
  valueList: number[],
  classCount: number
): number[] => {
  const validSortedValues = valueList
    .filter((number) => number !== undefined && number !== null)
    .sort((a, b) => a - b);
  if (dataType === MapDataType.GRID && validSortedValues.length < 2000) {
    console.log(`Found only ${validSortedValues.length} valid values for pollutant`);
    console.log(validSortedValues);
  }

  const breakPoints = calculateAdjustedBreakPoints(validSortedValues, classCount);
  breakPointCache.set(getStyleId(dataType, pollutantId), breakPoints);
  return [...breakPoints];
};

/**
 * Returns color code for the given feature by the given property name (pollutant id) and breakpoints.
 * If the feature does not have the property, returns "transparent" as the colour. If the property value
 * of the feature is higher than any of the breakpoints, it means that wrong breakpoints are being used
 * and thus error message is written (in this case "grey" is returned as the colour).
 */
const getFeatureColor = (
  breakPoints: number[],
  colors: string[],
  propName: string,
  feature: FeatureLike
): string => {
  const value = feature.get(propName);
  if (!value) {
    return "transparent"; // if value is null or undefined
  } else {
    for (let i = 0; i < breakPoints.length; i++) {
      if (value < breakPoints[i]) {
        return colors[i];
      }
    }
    console.error("Feature value is outside breakpoint ranges");
    return "gray"; // if value is outside breakpoint ranges
  }
};

/**
 * Returns function for assigning feature colors by selected feature property. The returned
 * function can be used inside OpenLayers StyleFunction. The returned function already has
 * parameters for breakPoints and respective colors assigned, and takes only property name
 * and feature (as expected by OpenLayers StyleFunction). The last breakpoint is replaced with
 * the given maximum property value (if it is higher). This allows the same style function
 * to be used with different map layers.
 */
export const getColorFunction = (
  featurePropName: string,
  breakPoints: number[],
  maxValue: number
): Function | undefined => {
  const adjustedBreakPoints = [...breakPoints];
  // replace last breakpoint with given maxValue if it is higher
  const secondLastBreakPoint = adjustedBreakPoints[adjustedBreakPoints.length - 2];
  if (maxValue > secondLastBreakPoint) {
    adjustedBreakPoints[adjustedBreakPoints.length - 1] = maxValue;
  }
  // get color scale by number of adjustedBreakPoints
  const colors = colorScale.slice(0, adjustedBreakPoints.length);
  return (feature: FeatureLike) =>
    getFeatureColor(adjustedBreakPoints, colors, featurePropName, feature);
};

/**
 * Returns rounded maximum value for the highest value class in legend. Number of significant figures in the
 * rounded value is one or more depending on how many are needed to make it distinct from the second last
 * breakpoint.
 */
const getRoundedMaxValueForLegend = (
  maxValue: number,
  secondLastBreakPoint: number
): number => {
  for (let i = 1; i < 10; i++) {
    const roundedMax = roundBreakPoint(maxValue, i);
    if (roundedMax !== secondLastBreakPoint) {
      return roundedMax;
    }
  }
  return maxValue;
};

/**
 * Returns Legend object from the given breakPoints array.
 */
export const getPollutantLegend = (
  pollutant: Pollutant,
  breakPoints: number[],
  maxValue: number
): PollutantLegend | undefined => {
  const colors = colorScale.slice(0, breakPoints.length);
  // replace last breakpoint with given maxValue if it is higher
  const secondLastBreakPoint = breakPoints[breakPoints.length - 2];
  if (maxValue > secondLastBreakPoint) {
    const roundedMax = getRoundedMaxValueForLegend(maxValue, secondLastBreakPoint);
    breakPoints[breakPoints.length - 1] = roundedMax;
  } else {
    // no values belong to the last class -> remove it from legend
    breakPoints.splice(-1, 1);
  }
  // create and return legend object
  return breakPoints.reduce(
    (legendObject, breakPoint, index) => {
      // set 0 as the min value of the first range
      const min = index > 0 ? breakPoints[index - 1] : 0;
      // set given max value as the max value of the last range
      const max = breakPoint;
      legendObject[index + 1] = { min, max, color: colors[index] };
      return legendObject;
    },
    {
      classNames: [...Array(breakPoints.length).keys()].map((i) => i + 1),
      unit: pollutant.unitLegend
    }
  );
};
