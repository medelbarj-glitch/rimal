// lib/translate.ts
export function getTranslatedField(item: any, field: string, locale: string): string {
    if (!item) return '';
    
    // If French (the default), just return the base field
    if (locale === 'fr') {
        return item[field] || '';
    }

    // Otherwise, try to find the localized field
    const localizedField = `${field}_${locale}`;
    
    // Return the localized version if it exists and is not empty, otherwise fallback to default
    if (item[localizedField] && item[localizedField].trim() !== '') {
        return item[localizedField];
    }
    
    return item[field] || '';
}
