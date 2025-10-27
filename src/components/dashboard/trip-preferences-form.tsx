'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RoadTripItineraryInput } from '@/ai/flows/generate-personalized-road-trip-itinerary';
import { Loader2, Sparkles } from 'lucide-react';

type PreferencesFormValues = Omit<RoadTripItineraryInput, 'startingPoint' | 'destination'>;

const preferencesSchema = z.object({
  tripType: z.array(z.string()).nonempty({ message: 'Please select at least one trip type.' }),
  vehicleType: z.array(z.string()).nonempty({ message: 'Please select a vehicle type.' }),
  interests: z.array(z.string()).nonempty({ message: 'Please select at least one interest.' }),
  lodgingPreferences: z.array(z.string()).nonempty({ message: 'Please select at least one lodging preference.' }),
  lodgingMemberships: z.array(z.string()).optional(),
});

interface TripPreferencesFormProps {
  onSubmit: (data: PreferencesFormValues) => void;
  isSubmitting: boolean;
}

const tripTypeOptions = ["Business", "Leisure", "Family Vacation", "Just Exploring"];
const vehicleTypeOptions = ["Car", "Van", "RV", "Truck", "Rental", "Toy Hauler", "5th Wheel"];
const interestOptions = ["Relax", "Shopping", "Hiking", "Biking", "Water Sports", "Sporting Events", "Concerts", "Comedy"];
const lodgingOptions = ["Hotel", "RV Park", "Glamping", "Camping", "Free Places to Stay (e.g., Cracker Barrel)"];
const membershipOptions = ["Military", "Elks Lodge", "KOA", "Harvest Host"];

const CheckboxGroup = ({ name, options, control, otherFieldName }: { name: keyof PreferencesFormValues, options: string[], control: any, otherFieldName?: string }) => {
    const [otherValue, setOtherValue] = useState('');
    const [isOtherChecked, setIsOtherChecked] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const oldVal = otherValue;
                    const newV = e.target.value;
                    setOtherValue(newV);

                    if (isOtherChecked) {
                        const currentValues = field.value ?? [];
                        const withoutOld = currentValues.filter((v: string) => v !== oldVal);
                        
                        if (newV) {
                           field.onChange([...withoutOld, newV]);
                        } else {
                           field.onChange(withoutOld);
                        }
                    }
                };

                const handleOtherCheckboxChange = (checked: boolean) => {
                    setIsOtherChecked(checked);
                    if (checked) {
                        if (otherValue) {
                            field.onChange([...(field.value ?? []), otherValue]);
                        }
                    } else {
                        field.onChange((field.value ?? []).filter((v: string) => v !== otherValue));
                    }
                };
                
                return (
                    <div className="space-y-2">
                        {options.map((option) => (
                            <div key={option} className="flex items-center gap-2">
                                <Checkbox
                                    id={`${name.toString()}-${option}`}
                                    checked={field.value?.includes(option) ?? false}
                                    onCheckedChange={(checked) => {
                                        const newValue = checked
                                            ? [...(field.value ?? []), option]
                                            : (field.value ?? []).filter((v: string) => v !== option);
                                        field.onChange(newValue);
                                    }}
                                />
                                <Label htmlFor={`${name.toString()}-${option}`}>{option}</Label>
                            </div>
                        ))}
                        {otherFieldName && (
                             <div className="flex items-center gap-2">
                                <Checkbox
                                    id={`${name.toString()}-other`}
                                    checked={isOtherChecked}
                                    onCheckedChange={handleOtherCheckboxChange}
                                />
                                 <Input
                                    placeholder="Other"
                                    className="h-8"
                                    value={otherValue}
                                    onChange={handleOtherChange}
                                />
                            </div>
                        )}
                    </div>
                )
            }}
        />
    );
};


export default function TripPreferencesForm({ onSubmit, isSubmitting }: TripPreferencesFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
        tripType: ['Leisure'],
        vehicleType: ['Car'],
        interests: ['Hiking'],
        lodgingPreferences: ['Hotel'],
        lodgingMemberships: [],
    },
  });

  const processSubmit = (data: PreferencesFormValues) => {
    onSubmit(data);
  };
  
  const renderError = (fieldName: keyof typeof errors) => {
      if (!errors[fieldName]) return null;
      const message = errors[fieldName]?.message;
      return <p className="text-xs text-destructive mt-1">{typeof message === 'string' ? message : 'Invalid input'}</p>;
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <Accordion type="multiple" defaultValue={['tripType', 'vehicleType', 'interests', 'lodgingPreferences']} className="w-full">
        <AccordionItem value="tripType">
          <AccordionTrigger>Trip Type</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup name="tripType" options={tripTypeOptions} control={control} otherFieldName="otherTripType"/>
            {renderError('tripType')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vehicleType">
          <AccordionTrigger>Vehicle Type</AccordionTrigger>
          <AccordionContent>
             <CheckboxGroup name="vehicleType" options={vehicleTypeOptions} control={control} otherFieldName="otherVehicleType" />
             {renderError('vehicleType')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="interests">
          <AccordionTrigger>Points of Interest</AccordionTrigger>
          <AccordionContent>
             <CheckboxGroup name="interests" options={interestOptions} control={control} otherFieldName="otherInterest" />
             {renderError('interests')}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="lodgingPreferences">
          <AccordionTrigger>Lodging Preferences</AccordionTrigger>
          <AccordionContent>
             <CheckboxGroup name="lodgingPreferences" options={lodgingOptions} control={control} otherFieldName="otherLodging" />
             {renderError('lodgingPreferences')}
          </AccordionContent>
        </AccordionItem>

         <AccordionItem value="lodgingMemberships">
          <AccordionTrigger>Lodging Memberships (Optional)</AccordionTrigger>
          <AccordionContent>
             <CheckboxGroup name="lodgingMemberships" options={membershipOptions} control={control} otherFieldName="otherMembership" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Generate Itinerary
      </Button>
    </form>
  );
}
