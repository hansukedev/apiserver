import { RefreshCw, Package } from 'lucide-react';

interface CurrentPlanProps {
    planData: {
        name: string;
        daysLeft: number;
        totalDuration: number;
        endDate: string;
        isFree: boolean;
    };
}

export default function CurrentPlanCard({ planData }: CurrentPlanProps) {
    const { name, daysLeft, totalDuration, endDate, isFree } = planData;

    // Calculate progress percentage
    // If totalDuration is 0 (avoid division by zero), set progress to 0.
    // Progress represents time ELAPSED? Or time REMAINING?
    // Design usually shows "how much is left" or "how much consumed".
    // "Green color" + "progress bar" usually implies "Good/Remaining" or "Health".
    // If we want "progress", usually it's time elapsed.
    // But let's look at the requested logic: `(daysLeft / totalDuration) * 100`.
    // This is PERCENT REMAINING.
    // If 30 days total, 30 days left -> 100% full.
    // If 0 days left -> 0% empty.

    let progressPercentage = 0;
    if (!isFree && totalDuration > 0) {
        progressPercentage = Math.max(0, Math.min(100, (daysLeft / totalDuration) * 100));
    }

    // Colors: Purple for icon bg. Green for progress bar.

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Plan</h2>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        {isFree ? (
                            <Package className="w-5 h-5 text-purple-600" />
                        ) : (
                            <RefreshCw className="w-5 h-5 text-purple-600" />
                        )}
                    </div>
                    <span className="text-xl font-bold text-gray-800 truncate" title={name}>
                        {name}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {!isFree ? (
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500">Valid Until</span>
                            <span className="text-gray-900 font-medium">{daysLeft} days left</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-green-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">{endDate}</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-500">Update to a paid plan to unlock more features.</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-3">
                            <div className="bg-gray-300 h-full rounded-full w-full" />
                        </div>
                    </div>
                )}

                <div className="text-right space-y-1 pt-2 border-t border-gray-50 mt-2">
                    <p className="text-xs text-gray-500">Keys: <span className="text-gray-900 font-medium">0 / 0</span></p>
                    <p className="text-xs text-gray-500">Packages: <span className="text-gray-900 font-medium">0 / 0</span></p>
                </div>
            </div>
        </div>
    );
}
