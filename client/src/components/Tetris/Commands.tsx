import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, Pause } from 'lucide-react';

export default function Commands() {
  const commands = [
    { key: <ArrowLeft className="w-4 h-4" />, action: 'Move Left' },
    { key: <ArrowRight className="w-4 h-4" />, action: 'Move Right' },
    { key: <ArrowDown className="w-4 h-4" />, action: 'Move Down' },
    { key: <RotateCw className="w-4 h-4" />, action: 'Rotate (Up Arrow)' },
    { key: <Pause className="w-4 h-4" />, action: 'Pause (P)' }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Controls</h2>
      <div className="space-y-2">
        {commands.map((command, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-muted rounded">
              {command.key}
            </div>
            <span className="text-sm">{command.action}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
