import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Volume2, VolumeX, Music, Music2, Smartphone, X } from 'lucide-react';
import { setVolume, getVolume, toggleSound, toggleMusic, vibrate } from '@/lib/audio';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [volume, setVolumeState] = useState(getVolume());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  const handleMusicToggle = () => {
    const newState = toggleMusic();
    setMusicEnabled(newState);
  };

  const handleVibrationToggle = () => {
    setVibrationEnabled(!vibrationEnabled);
    if (vibrationEnabled) {
      vibrate(100);
    }
  };

  const handleTestSound = () => {
    if (soundEnabled) {
      vibrate(50);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-100">Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Customize your gaming experience
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume
                </Label>
                <span className="text-sm text-gray-400">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-gray-300 flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Sound Effects
              </Label>
              <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-gray-300 flex items-center gap-2">
                <Music2 className="h-4 w-4" />
                Background Music
              </Label>
              <Switch checked={musicEnabled} onCheckedChange={handleMusicToggle} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-gray-300 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Vibration
              </Label>
              <Switch checked={vibrationEnabled} onCheckedChange={handleVibrationToggle} />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleTestSound}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Test Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
