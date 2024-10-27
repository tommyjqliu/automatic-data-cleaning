import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

type toast = ReturnType<typeof useToast>["toast"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function errorHandler<T extends (...args: any[]) => any>(
    toast: toast,
    fn: T,
) {
    return async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 413) {
                    toast({
                        title: "File too large",
                        variant: "destructive",
                        description:
                            "Due to Vercel restrictions, the file size is limited to 5MB. Please upload a smaller file.",
                    });
                } else {
                    toast({
                        title: "API request failed",
                        variant: "destructive",
                        description: error.response?.data?.message ?? "Unknown error",
                    });
                }
            } else {
                toast({
                    title: "API request failed",
                    variant: "destructive",
                    description: "Unknown error",
                });
            }
        }
    };
}
