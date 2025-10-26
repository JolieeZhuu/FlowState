import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CalendarEvent } from './types';

interface ScheduleAnalyzerProps {
    events: CalendarEvent[];
}

interface AnalysisSection {
    title: string;
    content: string;
}

export function ScheduleAnalyzer({ events }: ScheduleAnalyzerProps) {
    const [analysis, setAnalysis] = useState<AnalysisSection[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const formatEventsForGemini = (events: CalendarEvent[]) => {
        return events.map(event => ({
            title: event.title,
            date: event.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            day_of_week: event.date ? new Date(event.date).toLocaleString('en-US', { weekday: 'long' }) : 'Unknown',
            start_time: event.start_time,
            end_time: `${event.start_hour + event.duration}:00`,
            type: event.type
        }));
    };

    const analyzeSchedule = async (question?: string) => {
        try {
            const formattedEvents = formatEventsForGemini(events);
            console.log('ScheduleAnalyzer: sending formatted events', formattedEvents);
            const response = await fetch('http://localhost:3000/gemini/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ events: formattedEvents, question }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data.suggestions;
        } catch (error) {
            console.error('Error analyzing schedule:', error);
            throw error;
        }
    };

    useEffect(() => {
        const updateAnalysis = async () => {
            if (events.length === 0) {
                setAnalysis([{ title: "No Events", content: "Add events to see analysis." }]);
                return;
            }

            setIsLoading(true);
            try {
                const suggestion = await analyzeSchedule();
                setAnalysis([{ title: "Schedule Analysis", content: suggestion }]);
            } catch (error) {
                setAnalysis([{ title: "Analysis Error", content: (error instanceof Error) ? error.message : String(error) }]);
            } finally {
                setIsLoading(false);
            }
        };

        updateAnalysis();
    }, [events]);

    // Custom question UI state
    const [question, setQuestion] = useState<string>('');

    const askQuestion = async () => {
        setIsLoading(true);
        try {
            const suggestion = await analyzeSchedule(question.trim() ? question : undefined);
            setAnalysis([{ title: 'Answer', content: suggestion }]);
        } catch (err) {
            setAnalysis([{ title: 'Analysis Error', content: err instanceof Error ? err.message : String(err) }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg bg-white p-6 w-full">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Gemini / Schedule Analyzer</h2>
                <p className="text-sm text-gray-500">AI insights for your calendar</p>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ask a question</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-md border px-3 py-2"
                        placeholder="e.g. Are there any scheduling conflicts?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button
                        onClick={askQuestion}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white"
                        disabled={isLoading}
                    >
                        Ask
                    </button>
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Analyzing your schedule...</p>
                        </div>
                    ) : (
                        analysis.map((section, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">{section.title}</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
