
import { Skeleton } from '@/components/ui/skeleton';

interface EventHeaderProps {
  title: string;
  description: string;
  isLoading?: boolean;
}

const EventHeader = ({ title, description, isLoading = false }: EventHeaderProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight text-stream-text md:text-3xl">{title}</h1>
      <p className="text-stream-muted">{description}</p>
    </div>
  );
};

export default EventHeader;
