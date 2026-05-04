import React from 'react';
import { Loader2, MailCheck } from 'lucide-react';

function formatSentTooltip(iso) {
  if (!iso) return 'Chase letter sent — send time not recorded';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Chase letter sent — send time not recorded';
  }
  const when = date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
  return `Chase letter sent ${when}`;
}

export default function ChaseSendStatus({ event, compact = false }) {
  if (!event) return null;

  if (event.status === 'sending') {
    const started = event.startedAt
      ? new Date(event.startedAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      : null;
    return (
      <span
        title={started ? `Sending chase letter (started ${started})` : 'Sending chase letter'}
        aria-label={started ? `Sending chase letter, started ${started}` : 'Sending chase letter'}
        className={`inline-flex shrink-0 items-center gap-1 rounded-md border border-accent/40 bg-accent/10 font-medium text-accent-ink ${
          compact ? 'px-1.5 py-1 text-[11px]' : 'px-2 py-1 text-[11px]'
        }`}
      >
        <Loader2
          size={compact ? 12 : 13}
          strokeWidth={2.25}
          className="animate-spin"
        />
        {!compact ? <span>Sending</span> : null}
      </span>
    );
  }

  if (event.status === 'sent') {
    const tooltip = formatSentTooltip(event.sentAt);
    return (
      <span
        title={tooltip}
        aria-label={tooltip}
        className={`inline-flex shrink-0 items-center gap-1 rounded-md border border-ok-100 bg-ok-50 font-medium text-ok-700 ${
          compact ? 'px-1.5 py-1 text-[11px]' : 'px-2 py-1 text-[11px]'
        }`}
      >
        <MailCheck size={compact ? 12 : 13} strokeWidth={2.25} />
        {!compact ? <span>Sent</span> : null}
      </span>
    );
  }

  return null;
}
