export default function downloadCsv(data: Record<string, string>[], headers: string[]) {
    // Convert CSV data to string
    const csvContent = [
        headers.join(','), // CSV header
        ...data.map(row => headers.map(header => row[header]).join(',')) // CSV rows
    ].join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cleaned_data.csv');

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by removing the link and revoking the Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}