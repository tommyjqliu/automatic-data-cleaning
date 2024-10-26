import Papa from 'papaparse';

export default async function parseCsv(data: string): Promise<Record<string, string>[]> {
    const csv = await new Promise<Record<string, string>[]>((resolve, reject) => {
        Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data as Record<string, string>[]);
            },
            error: (err: unknown) => {
                reject(err);
            },
        });
    });

    return csv;
}