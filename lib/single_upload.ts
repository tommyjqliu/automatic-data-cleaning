interface uploadOptions<M extends boolean> {
  accept?: string;
  multiple?: M;
}

export default function triggerUpload<M extends boolean = false>(
  options: uploadOptions<M> = {},
) {
  return new Promise<(M extends true ? FileList : File) | null>((resolve) => {
    // Create a file input element
    const fileInput = document.createElement("input");
    const { accept = "", multiple = false } = options;
    fileInput.type = "file";
    fileInput.multiple = multiple;
    fileInput.accept = accept;
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Set up the change event listener
    fileInput.addEventListener("change", () => {
      if (multiple) {
        const files = fileInput.files;
        resolve(files as M extends true ? FileList : File);
      } else {
        const file = fileInput.files?.[0];
        resolve(file as M extends true ? FileList : File);
      }
      // Clean up: remove the input element
      document.body.removeChild(fileInput);
    });

    // Handle the case where the user cancels the file selection
    fileInput.addEventListener("cancel", () => {
      resolve(null);
      document.body.removeChild(fileInput);
    });

    // Trigger the file selection window
    fileInput.click();
  });
}
