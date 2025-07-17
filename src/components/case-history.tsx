
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Activity,
  BotMessageSquare,
  Video,
  Save,
  FileText,
  Link,
  BookUser,
} from 'lucide-react';
import type { CaseHistoryItem, HealthData } from '@/lib/types';
import { Button } from './ui/button';

type CaseHistoryProps = {
  data: HealthData;
  t: any;
};

const iconMap: { [key: string]: React.ElementType } = {
  'AI Analysis': BotMessageSquare,
  'Consultation Booked': BookUser,
  'Video Consultation': Video,
  'Data Saved': Save,
  'Report Generated': FileText,
  default: Activity,
};

export function CaseHistory({ data, t }: CaseHistoryProps) {
  const { caseHistory } = data;

  const getFormattedTimestamp = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return 'Date not available';
    }
    return new Date(timestamp.toDate()).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {caseHistory && caseHistory.length > 0 ? (
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
            <div className="space-y-8">
              {caseHistory
                .slice()
                .sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0))
                .map((item: CaseHistoryItem) => {
                  const Icon = iconMap[item.type] || iconMap.default;
                  return (
                    <div key={item.id} className="relative flex items-start">
                      <div className="absolute left-0 top-1.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-4 ring-border">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-10">
                        <h4 className="font-semibold">{item.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {getFormattedTimestamp(item.timestamp)}
                        </p>
                        <p className="mt-1 text-sm">{item.description}</p>
                        {item.details?.url && (
                          <Button variant="link" asChild className="p-0 h-auto mt-1">
                            <a href={item.details.url} target="_blank" rel="noopener noreferrer">
                              <Link className="mr-2 h-3 w-3" /> View Uploaded Video
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-10 border-2 border-dashed rounded-lg">
            {t.noHistory}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
