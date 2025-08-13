# Internationalization (i18n) Setup

This project supports multiple languages with Norwegian (no) as the default and English (en) as an additional language. The system is designed to make it easy to add more languages in the future.

## How It Works

### Language Files
Translation files are stored in `src/locales/` as JSON files:
- `no.json` - Norwegian (default)
- `en.json` - English

### Language Detection
The system detects the current language in this order:
1. URL parameter (`?lang=en`)
2. localStorage value
3. Default language (Norwegian)

### Key Features
- URL-based language switching with `?lang=` parameter
- Persistent language preference in localStorage
- Language picker component in the footer
- Support for interpolated text (placeholders like `{authorLink}`)
- Server-side rendering compatible

## File Structure

```
src/
├── utils/
│   └── i18n.ts                 # Core i18n utilities
├── locales/
│   ├── no.json                 # Norwegian translations
│   └── en.json                 # English translations
├── components/
│   └── LanguagePicker.astro    # Language selector component
└── content/
    ├── Header.astro            # Uses site.title and taglines
    ├── Footer.astro            # Uses navigation translations
    ├── Cards.astro             # Uses card titles
    ├── AboutDialog.astro       # Uses about section
    ├── ScheduleSettingsDialog.astro # Uses schedule dialog
    └── ...
```

## Adding a New Language

### 1. Create Translation File
Create a new JSON file in `src/locales/` (e.g., `de.json` for German):

```json
{
  "site": {
    "title": "Instabart",
    "taglines": [
      "Coole NTNU-Dienste. Sofort verfügbar",
      "Lieblings-App der Trondheimer Studenten seit 1917!",
      // ... more taglines
    ]
  },
  "navigation": {
    "settings": "Einstellungen",
    "about": "Über Instabart",
    "close": "Schließen"
  },
  // ... rest of the translations following the same structure
}
```

### 2. Update Language Configuration
In `src/utils/i18n.ts`, add the new language to the `languages` object:

```typescript
export const languages = {
  no: 'Norsk',
  en: 'English',
  de: 'Deutsch'  // Add new language
} as const;
```

### 3. Update LanguagePicker Component
In `src/components/LanguagePicker.astro`, add a new button for the language:

```html
<button
  id="language-de"
  class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
  role="menuitem"
  data-lang="de"
>
  Deutsch
</button>
```

### 4. Update Translation Loading
In `src/utils/i18n.ts`, update the `getTranslations` function:

```typescript
export function getTranslations(lang?: Language) {
  const currentLang = lang || getCurrentLanguage();
  
  switch (currentLang) {
    case 'en':
      return import('../locales/en.json');
    case 'de':
      return import('../locales/de.json');  // Add new case
    case 'no':
    default:
      return import('../locales/no.json');
  }
}
```

## Usage in Components

### Import Translations
```typescript
import { getCurrentLanguage } from '../utils/i18n.ts';
import noTranslations from '../locales/no.json';
import enTranslations from '../locales/en.json';

const currentLang = getCurrentLanguage();
const translations = currentLang === 'en' ? enTranslations : noTranslations;
```

### Use in Templates
```astro
<h1>{translations.site.title}</h1>
<p>{translations.about.whatIs.title}</p>
```

### Interpolated Text
For text with placeholders (like links), use a helper function:

```typescript
function replacePlaceholders(text: string, replacements: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(`{${key}}`, value);
  }
  return result;
}
```

Then use it in the template:
```astro
<Fragment set:html={replacePlaceholders(translations.about.whoMade.description, {
  authorLink: `<a href="https://mvn.no">${translations.about.links.author}</a>`
})} />
```

## Translation Structure

The translation files follow this structure:

```json
{
  "site": {
    "title": "Site title",
    "taglines": ["Random taglines array"]
  },
  "navigation": {
    "settings": "Settings",
    "about": "About",
    "close": "Close"
  },
  "theme": {
    "dark": "Dark",
    "light": "Light"
  },
  "cards": {
    "blackboard": "Blackboard",
    "email": "Email",
    // ... all card titles
  },
  "about": {
    "title": "About Title",
    "whatIs": {
      "title": "Section title",
      "description1": "First paragraph",
      "description2": "Second paragraph"
    },
    // ... more about sections
  },
  "schedule": {
    "dialog": {
      "title": "Dialog title",
      "description": "Dialog description",
      // ... more dialog content
    }
  },
  "language": {
    "label": "Language",
    "norwegian": "Norsk",
    "english": "English"
  }
}
```

## Language Switching

Users can switch languages by:
1. Clicking the language picker in the footer
2. Adding `?lang=en` to the URL
3. The choice is saved to localStorage and persists across sessions

## Development Notes

- Always test new languages thoroughly
- Ensure all placeholders are properly replaced
- Check that the language picker dropdown updates correctly
- Verify that the page reloads when language is changed to apply all translations
- Some translations (like in scripts) use `define:vars` to pass server-side values to client-side code

## Maintenance

When adding new translatable content:
1. Add the text to all language files (`no.json`, `en.json`, etc.)
2. Update the component to use the translation
3. Test with all supported languages

The fallback is always Norwegian (the default language), so if a translation is missing, it will show the Norwegian version.
