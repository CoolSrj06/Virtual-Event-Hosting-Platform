
import { useState } from 'react';
import EventsList from '@/components/EventsList';

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-stream-background">
      <div className="container max-w-7xl py-8 px-4 sm:px-6">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-stream-text md:text-4xl">
            Virtual Events
          </h1>
          <p className="text-xl text-stream-muted">
            Browse and join interactive virtual events
          </p>
        </div>

        <EventsList />
      </div>
    </div>
  );
};

export default EventsPage;
