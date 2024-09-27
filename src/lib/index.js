// place files you want to import through the `$lib` alias in this folder.
export const convertToNumber = (str) => {
  
  if (str === 'NA') return Infinity;
  if (str === 'Don\'t know') return Infinity;
  if (str.includes('and up')) return parseFloat(str) * 1e6;
  if (str.includes('or more')) return parseFloat(str) * 1e6;
  
  const match = str.match(/(\d+\.?\d*)[K|M]/);  // Extract the number part
  if (!match) return 0;

  let value = parseFloat(match[1]);
  if (str.includes('K')) value *= 1e3;
  if (str.includes('M')) value *= 1e6;
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