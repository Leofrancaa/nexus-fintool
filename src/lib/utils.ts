export function cn(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}

/**
 * Formata uma data string (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
 * Evita problemas de timezone ao não converter para Date object
 */
export function formatDateBR(dateString: string): string {
    if (!dateString) return ''

    // Pegar apenas a parte da data (YYYY-MM-DD)
    const datePart = dateString.split('T')[0].split(' ')[0]
    const [year, month, day] = datePart.split('-')

    return `${day}/${month}/${year}`
}
