import { EventsClient } from "@/app/events/EventsClient";
import { getPublishedOrEmpty } from "@/lib/site-db";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { events } = await getPublishedOrEmpty();
  return <EventsClient events={events} />;
}
