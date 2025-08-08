"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnauthorizedPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push("/signin");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const handleSignIn = () => {
        router.push("/signin");
    };

    const handleGoHome = () => {
        router.push("/");
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-600">
                        Access Denied
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        You need to be logged in to access this page. Please sign in to continue.
                    </p>

                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Redirecting to sign in page in{" "}
                            <span className="font-bold text-primary">{countdown}</span> seconds
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={handleSignIn} className="w-full">
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In Now
                        </Button>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleGoBack} className="flex-1">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Go Back
                            </Button>
                            <Button variant="outline" onClick={handleGoHome} className="flex-1">
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}