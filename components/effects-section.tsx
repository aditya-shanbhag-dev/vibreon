"use client";
import { IconBrandDeezer } from "@tabler/icons-react";
import { useId } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";

interface EffectsSelectorProps {
    effect: string;
    setEffect: (value: string) => void;
}

export default function EffectsSection({ effect, setEffect }: EffectsSelectorProps) {

    const id = useId();

    const songEffects = [
        { value: 'normal', label: 'Normal' },
        { value: 'slowed_reverb', label: 'Slowed + Reverb' },
        { value: 'bass_boosted', label: 'Bass Boosted' },
        { value: 'slowed_bass_boosted', label: 'Slowed + Bass Boosted' },
        { value: 'sped_up_reverb', label: 'Sped Up + Reverb' },
        { value: 'sped_up_nightcore', label: 'Sped Up + Nightcore' },
        { value: 'vaporwave', label: 'Vaporwave Version' },
        { value: 'dreamcore', label: 'Dreamcore Version' },
        { value: 'lofi', label: 'Rainy Mood / Lofi' },
        { value: 'chipmunk', label: 'Chipmunk Version' },
        { value: '8D', label: '8D Audio' },
        { value: 'underwater', label: 'Underwater / Dreamy Muffled' }
    ];

    return (
        <fieldset className='w-full space-y-4'>
            <legend className="text-foreground text-xl tracking-tight leading-none font-medium flex items-center gap-2">
                <IconBrandDeezer /> Select Effects:
            </legend>
            <RadioGroup className='grid grid-cols-4 gap-5'
                defaultValue='normal' value={effect}
                onValueChange={setEffect}
            >
                {songEffects.map(item => (
                    <label
                        key={`${id}-${item.value}`}
                        className={cn('border-input has-data-[state=checked]:border-primary/80 has-data-[state=checked]:bg-muted/60',
                            'has-focus-visible:border-ring has-data-[state=checked]:border-2 has-focus-visible:ring-ring/50 relative flex flex-col items-center gap-3 rounded-md',
                            'border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-10',
                            'has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 hover:scale-110')}
                    >
                        <RadioGroupItem
                            id={`${id}-${item.value}`}
                            value={item.value}
                            className='sr-only after:absolute after:inset-0'
                            aria-label={`size-radio-${item.value}`}
                        />
                        <p className='text-foreground text-sm leading-none font-medium'>{item.label}</p>
                    </label>
                ))}
            </RadioGroup>
        </fieldset>
    );
}
