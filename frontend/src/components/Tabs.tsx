import React, { useState } from 'react';
import { Calendar, Home, Settings, Users } from 'lucide-react';
import ActualCalendar from './ActualCalendar';
import CalendarComparison from './CalendarComparison';
import IdealCalendar from './IdealCalendar';
import Stats from './Stats';
import { type CalendarEvent } from './types';

// Main App with Tabs
export default function TabbedApp() {
  const [idealEvents, setIdealEvents] = useState<CalendarEvent[]>([]);
  const [actualEvents, setActualEvents] = useState<CalendarEvent[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Define your tabs here
  const tabs = [
    { id: 'home', label: 'Ideal', icon: Home, component: IdealCalendar },
    { id: 'calendar', label: 'Actual', icon: Calendar, component: ActualCalendar },
    { id: 'team', label: 'Comparison', icon: Users, component: CalendarComparison },
    { id: 'settings', label: 'Stats', icon: Settings, component: Stats },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || IdealCalendar;

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <ActiveComponent />
      </div>
    </div>
  );
};