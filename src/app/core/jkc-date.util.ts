// src/app/core/jkc-date.util.ts

/** Noms des mois JocKeCorp, indexés comme les mois JS (0 = janvier) */
export const JKC_MONTHS = [
    'Orphéon',   // 0  → janvier
    'Solenar',   // 1  → février
    'Keryon',    // 2  → mars
    'Thaleïon',  // 3  → avril
    'Asterion',  // 4  → mai
    'Neréïde',   // 5  → juin
    'Drakonis',  // 6  → juillet
    'Lysandra',  // 7  → août
    'Abysséa',   // 8  → septembre
    'Korôn',     // 9  → octobre
    'Heliar',    // 10 → novembre
    'Vesperion', // 11 → décembre
] as const;

// 04/06/1972 → date de référence JocKeCorp
// Attention: mois JS 0-based → 5 = juin
export const JKC_EPOCH = new Date(1972, 5, 4);

/**
 * Options d’affichage.
 * - format: 'long' = "4 Orphéon 53 AJ", 'short' = "4 Orphéon".
 * - showGregorian: ajoute "(2025)" après l’année AJ.
 */
export interface JkcDateFormatOptions {
    format?: 'long' | 'short';
    showGregorianYear?: boolean;
}

/** Convertit n’importe quelle date vers le format JocKeCorp. */
export function formatJkcDate(
    input: Date | string | number | null | undefined,
    options: JkcDateFormatOptions = {}
): string {
    if (!input) return '';

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return '';

    const { format = 'long', showGregorianYear = false } = options;

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = JKC_MONTHS[monthIndex] ?? '???';

    const eraYear = computeJkcEraYear(date);
    const gregYear = date.getFullYear();

    // Avant la naissance du calendrier JocKeCorp
    if (date < JKC_EPOCH) {
        // Tu peux rendre ça plus poétique si tu veux
        const base = `${pad2(day)} ${monthName} (avant le calendrier JocKeCorp™)`;
        return showGregorianYear ? `${base} (${gregYear})` : base;
    }

    if (format === 'short') {
        return `${pad2(day)} ${monthName}`;
    }

    // format 'long'
    let result = `${pad2(day)} ${monthName} ${eraYear} AJ`;
    if (showGregorianYear) {
        result += ` (${gregYear})`;
    }
    return result;
}

/** Calcule l'année AJ (Après Jocke), en partant du 04/06/1972 = 1 AJ. */
function computeJkcEraYear(date: Date): number {
    if (date < JKC_EPOCH) return 0;

    const yearDiff = date.getFullYear() - 1972;

    // Anniversaire JKC dans l'année de la date
    const jkcAnniversaryThisYear = new Date(date.getFullYear(), 5, 4); // 4 juin

    let eraYear = yearDiff;
    if (date < jkcAnniversaryThisYear) {
        eraYear -= 1;
    }

    // On commence à 1 AJ le 04/06/1972
    return eraYear + 1;
}

function pad2(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}
