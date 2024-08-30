export function getHeaders(data: Record<string, unknown> | unknown[]): {
  rowHeaders: Array<PropertyKey>;
  colHeaders: Array<PropertyKey>;
} {
  let rowHeaders: Array<PropertyKey> = [];
  // is an array
  if (Array.isArray(data)) {
    const nRows = data.length;
    rowHeaders = [...Array(nRows).keys()];
  } else {
    // is an object
    // keys are row indexes
    rowHeaders = Object.keys(data);
  }

  // Time: O(nRows * nCols)
  const colHeaders = rowHeaders.reduce((colHeaders, rowHeader) => {
    const row = data[rowHeader as keyof typeof data];
    if (typeof row === 'object' && row !== null) {
      /* O(nCols) Could optimize `includes` here */
      const cols = Object.keys(row);
      cols.reduce((xs, x) => {
        if (!xs.includes(x)) {
          /* xs is the colHeaders to be filled by searching the row's indexes */
          xs.push(x);
        }
        return xs;
      }, colHeaders);
    }
    return colHeaders;
  }, [] as Array<PropertyKey>);
  return {
    rowHeaders: rowHeaders,
    colHeaders: colHeaders,
  };
}
