import dayjs from "dayjs";
import Color from "color";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterSearch<T extends Record<string, any>>(
  allArray: T[],
  searchKey: keyof T,
  searchText: string,
) {
  if (searchText !== "") {
    return allArray.filter((item) => {
      const value = String(item[searchKey]).toLowerCase();
      return value.includes(searchText.toLowerCase());
    });
  }
  return allArray;
}

export function makeArrayUnique<T>(arr: T[], key: keyof T): T[] {
  const uniqueSet = new Set();
  const uniqueArray: T[] = [];

  arr.forEach((obj) => {
    const uniqueValue = criterion(obj, key);

    if (!uniqueSet.has(uniqueValue)) {
      uniqueSet.add(uniqueValue);
      uniqueArray.push(obj);
    }
  });

  return uniqueArray;
}

export function groupBy(arr, prop) {
  return arr.reduce((acc, obj) => {
    const key = obj[prop];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

function criterion<T>(person: T, key: keyof T) {
  return person[key];
}

export const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format);
};

export const supportedFileTypes = [
  "geojson",
  "shapefile",
  "geopackage",
  "geobuf",
  "csv",
  "xlsx",
  "kml",
  "mvt",
  "wfs",
  "binary",
  "wms",
  "xyz",
  "wmts",
  "mvt",
  "csv",
  "xlsx",
  "json",
];

export const calculateLayersCountByKey = (
  data: [] | undefined,
  keyToCount: string,
) => {
  let count = 0;

  data?.forEach((obj) => {
    if (obj[keyToCount]) {
      count++;
    }
  });

  return count;
};

export const calculateLayersCountByKeyAndValue = (
  data: [] | undefined,
  keyToCount: string,
  value: string,
) => {
  let count = 0;

  data?.forEach((obj) => {
    if (obj[keyToCount] === value) {
      count++;
    }
  });

  return count;
};

export function changeColorOpacity(params: {
  color: string;
  opacity: number;
}): string {
  const { color, opacity } = params;
  return new Color(color).rgb().alpha(opacity).string();
}

export function getFrequentValuesOnProperty<T>(
  arrayGiven: T[],
  property: keyof T,
): string[] {
  const typeCounts: Record<string, number> = arrayGiven.reduce(
    (counts, currObject) => {
      const propertyValue = currObject[property] as string;
      counts[propertyValue] = (counts[propertyValue] || 0) + 1;
      return counts;
    },
    {},
  );

  return Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]);
}

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = "asc" | "desc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  array: readonly any[],
  comparator: (a, b) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function isValidHex(hex) {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

export function isValidRGB(rgb) {
  return (
    rgb.r >= 0 &&
    rgb.r <= 255 &&
    rgb.g >= 0 &&
    rgb.g <= 255 &&
    rgb.b >= 0 &&
    rgb.b <= 255
  );
}

export function hexToRgb(hex: string): number[] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [r, g, b];
}
