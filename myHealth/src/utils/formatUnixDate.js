
// changes unix date into xx/xx/xxxx format
export const formatUnixDate = (value) => {
  if (!value) return "";
  return new Date(Number(value) * 1000).toLocaleDateString("en-GB");
};


