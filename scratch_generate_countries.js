const fs = require('fs');

async function generateCountries() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,translations,flag');
    const data = await res.json();
    
    let countries = data
      .filter(c => c.idd && c.idd.root)
      .map(c => {
        const root = c.idd.root;
        const suffixes = c.idd.suffixes || [''];
        // Use just the first suffix for simplicity if there are many, or if suffix is long, just use root
        const code = suffixes.length === 1 ? root + suffixes[0] : root;
        
        return {
          name: c.translations?.fra?.common || c.name.common,
          code: code,
          flag: c.flag
        };
      })
      .filter(c => c.code && c.flag)
      .sort((a, b) => a.name.localeCompare(b.name));

    // Deduplicate by name and code
    const uniqueCountries = [];
    const seen = new Set();
    for (const c of countries) {
      const key = `${c.name}-${c.code}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCountries.push(c);
      }
    }

    const fileContent = `export interface CountryCode {
  name: string;
  code: string;
  flag: string;
}

export const countryCodes: CountryCode[] = ${JSON.stringify(uniqueCountries, null, 2)};
`;
    
    fs.writeFileSync('lib/countries.ts', fileContent);
    console.log('Countries generated successfully');
  } catch (err) {
    console.error(err);
  }
}

generateCountries();
