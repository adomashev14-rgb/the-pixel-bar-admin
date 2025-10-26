import * as React from 'react';

export type Event<T = unknown> = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: T;
};

type Accessor<TEvent> = keyof TEvent | ((event: TEvent) => Date);

type Messages = Partial<Record<'next' | 'previous' | 'today' | 'month' | 'week' | 'day' | string, string>>;

type CalendarProps<TEvent extends Event = Event> = {
  events: TEvent[];
  startAccessor?: Accessor<TEvent>;
  endAccessor?: Accessor<TEvent>;
  localizer: unknown;
  style?: React.CSSProperties;
  messages?: Messages;
} & React.HTMLAttributes<HTMLDivElement>;

export const Calendar: <TEvent extends Event = Event>(props: CalendarProps<TEvent>) => React.ReactElement | null;

export function dateFnsLocalizer(config: {
  format: (...args: unknown[]) => string;
  parse: (...args: unknown[]) => Date;
  startOfWeek: (...args: unknown[]) => Date;
  getDay: (...args: unknown[]) => number;
  locales?: Record<string, unknown>;
}): unknown;
