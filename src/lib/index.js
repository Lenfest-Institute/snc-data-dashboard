// place files you want to import through the `$lib` alias in this folder.
export const convertToNumber = (str) => {
  // Remove any dollar signs and normalize 'million' to 'M'
  str = str.replace(/\$/g, '').replace(/ million/gi, 'M').replace(/ billion/gi, 'B');

  if (str === 'NA' || str === "Don't know") return Infinity;

  // Handle cases at the start of the sequence
  if (str.includes('Less than')) {
    return 1;
  }

  // Handle cases like 'and up' or 'or more'
  if (str.includes('and up') || str.includes('or more')) {
    return parseFloat(str) * 1e6;
  }

  // Match number with 'K', 'M', or 'B' (billion) suffix
  const match = str.match(/(\d+\.?\d*)([KMB])/);
  if (!match) return 0;

  let value = parseFloat(match[1]);
  const suffix = match[2];

  // Multiply based on suffix
  if (suffix === 'K') value *= 1e3;
  if (suffix === 'M') value *= 1e6;
  if (suffix === 'B') value *= 1e9;  // Handle billion

  return value;
};


 export const filterOptionsFocus = [
    {label: "Single Topic", value: "Prime_Single"},
    {label: "Related Topics", value: "Prime_Multi"},
    {label: "General Coverage", value: "Prime_Gen"}
  ];

 export const filterOptionsPriority = [
    {label: "News", value: "Cover_News"},
    {label: "Investigative", value: "Cover_Invest"},
    {label: "Analysis", value: "Cover_Analysis"}
  ];