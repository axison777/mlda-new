import { Check, Loader, MapPin } from 'lucide-react';

const LogisticsTimeline = ({ steps }) => {
    return (
        <div className="relative">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;

                return (
                    <div key={step.id} className="relative flex gap-6 pb-8">
                        {/* Timeline Line & Indicator */}
                        <div className="relative flex flex-col items-center">
                            {/* Indicator Circle */}
                            <div className="relative z-10">
                                {step.status === 'completed' && (
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                        <Check className="w-6 h-6 text-white" strokeWidth={3} />
                                    </div>
                                )}

                                {step.status === 'current' && (
                                    <div className="relative">
                                        {/* Ping Animation */}
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-mdla-yellow opacity-75 animate-ping"></span>
                                        <div className="relative w-12 h-12 rounded-full bg-mdla-yellow flex items-center justify-center shadow-lg">
                                            <MapPin className="w-6 h-6 text-mdla-black" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                )}

                                {step.status === 'pending' && (
                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                    </div>
                                )}
                            </div>

                            {/* Vertical Line */}
                            {!isLast && (
                                <div
                                    className={`w-1 flex-1 mt-2 ${step.status === 'completed'
                                            ? 'bg-green-500'
                                            : step.status === 'current'
                                                ? 'bg-gradient-to-b from-mdla-yellow to-gray-300'
                                                : 'bg-gray-300'
                                        }`}
                                    style={{ minHeight: '60px' }}
                                ></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                            <div className={`${step.status === 'current'
                                    ? 'bg-mdla-yellow/10 border-2 border-mdla-yellow'
                                    : 'bg-white border border-gray-200'
                                } rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}>
                                <h3 className={`text-lg font-bold mb-1 ${step.status === 'current' ? 'text-mdla-black' : 'text-gray-900'
                                    }`}>
                                    {step.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-2">
                                    {step.date}
                                </p>

                                <p className="text-sm italic text-gray-700">
                                    {step.description}
                                </p>

                                {step.status === 'current' && (
                                    <div className="mt-3 flex items-center gap-2 text-mdla-black">
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span className="text-xs font-semibold">En cours...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LogisticsTimeline;
