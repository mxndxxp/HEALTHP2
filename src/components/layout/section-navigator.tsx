'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type SectionNavigatorProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sectionOrder: string[];
  sectionTitles: { [key: string]: string };
};

export function SectionNavigator({
  activeSection,
  setActiveSection,
  sectionOrder,
  sectionTitles,
}: SectionNavigatorProps) {
  const currentIndex = sectionOrder.indexOf(activeSection);
  const prevSectionId = currentIndex > 0 ? sectionOrder[currentIndex - 1] : null;
  const nextSectionId = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;

  const prevSectionTitle = prevSectionId ? sectionTitles[prevSectionId] : '';
  const nextSectionTitle = nextSectionId ? sectionTitles[nextSectionId] : '';

  // Don't render navigator on dashboard or final insights page
  if (activeSection === 'dashboard' || activeSection === 'aiInsights') {
    return null;
  }

  return (
    <div className="mt-8 flex justify-between items-center border-t pt-6">
      <div>
        {prevSectionId && (
          <Button variant="outline" onClick={() => setActiveSection(prevSectionId)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Previous</div>
              <div>{prevSectionTitle}</div>
            </div>
          </Button>
        )}
      </div>
      <div>
        {nextSectionId && (
          <Button variant="outline" onClick={() => setActiveSection(nextSectionId)}>
             <div className="text-right">
              <div className="text-xs text-muted-foreground">Next</div>
              <div>{nextSectionTitle}</div>
            </div>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
