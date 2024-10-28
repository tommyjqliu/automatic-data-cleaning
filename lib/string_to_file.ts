/**
 * Convert a string to a File object
 */
export default function stringToCsv(data: string, filename: string) {
    return new File([data], filename, { type: 'text/csv;charset=utf-8;' });
}