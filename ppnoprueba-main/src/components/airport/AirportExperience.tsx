import { Header } from './Header';
import { useAirportExperience } from '@/hooks/useAirportExperience';
import { Stage0Welcome } from './stages/Stage0Welcome';
import { Stage1CheckIn } from './stages/Stage1CheckIn';
import { Stage2Route } from './stages/Stage2Route';
import { Stage3Luggage } from './stages/Stage3Luggage';
import { Stage4ConveyorBelt } from './stages/Stage4ConveyorBelt';
import { Stage5Security } from './stages/Stage5Security';
import { Stage6Passport } from './stages/Stage6Passport';
import { Stage7Boarding } from './stages/Stage7Boarding';
import { Stage8DutyFree } from './stages/Stage8DutyFree';
import { Stage9Lounge } from './stages/Stage9Lounge';
import { Stage10Flight } from './stages/Stage10Flight';
import { Stage11Arrival } from './stages/Stage11Arrival';

export function AirportExperience() {
  const {
    stage,
    progress,
    isTransitioning,
    sfxEnabled,
    ambientEnabled,
    goNext,
    goTo,
    resetExperience,
    initAudio,
    toggleSFX,
    toggleAmbient,
    playSFX,
    vibrate
  } = useAirportExperience();

  const renderStage = () => {
    const commonProps = { playSFX, vibrate };

    switch (stage) {
      case 0:
        return <Stage0Welcome onNext={goNext} onInitAudio={initAudio} playSFX={playSFX} />;
      case 1:
        return <Stage1CheckIn onNext={goNext} {...commonProps} />;
      case 2:
        return <Stage2Route onNext={goNext} {...commonProps} />;
      case 3:
        return <Stage3Luggage onNext={goNext} {...commonProps} />;
      case 4:
        return <Stage4ConveyorBelt onNext={goNext} {...commonProps} />;
      case 5:
        return <Stage5Security onNext={goNext} {...commonProps} />;
      case 6:
        return <Stage6Passport onNext={goNext} {...commonProps} />;
      case 7:
        return <Stage7Boarding onNext={goNext} {...commonProps} />;
      case 8:
        return <Stage8DutyFree onNext={goNext} {...commonProps} />;
      case 9:
        return <Stage9Lounge onNext={goNext} {...commonProps} />;
      case 10:
        return <Stage10Flight onNext={goNext} {...commonProps} />;
      case 11:
        return <Stage11Arrival {...commonProps} />;
      default:
        return <Stage0Welcome onNext={goNext} onInitAudio={initAudio} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-background grain">
      {/* Header - hide on stage 0 */}
      {stage > 0 && (
        <Header
          stage={stage}
          progress={progress}
          sfxEnabled={sfxEnabled}
          ambientEnabled={ambientEnabled}
          onToggleSFX={toggleSFX}
          onToggleAmbient={toggleAmbient}
          onReset={resetExperience}
        />
      )}

      {/* Stage content */}
      <main className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {renderStage()}
      </main>
    </div>
  );
}
