
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Briefcase, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OnboardingOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  recommended?: boolean;
}

const onboardingOptions: OnboardingOption[] = [
  {
    id: 'private-limited',
    title: 'Private Limited Company',
    description: 'Best for startups and businesses planning to scale',
    icon: <Building className="h-6 w-6" />,
    benefits: [
      'Limited liability protection',
      'Easier to raise capital',
      'Professional credibility',
      'Perpetual existence',
    ],
    recommended: true,
  },
  {
    id: 'llp',
    title: 'Limited Liability Partnership',
    description: 'Best for professional services and partnerships',
    icon: <Users className="h-6 w-6" />,
    benefits: [
      'Limited liability protection',
      'Flexible management structure',
      'Less compliance requirements',
      'No minimum capital requirement',
    ],
  },
  {
    id: 'opc',
    title: 'One Person Company',
    description: 'Best for solopreneurs and single ownership',
    icon: <Briefcase className="h-6 w-6" />,
    benefits: [
      'Single shareholder structure',
      'Limited liability protection',
      'Easier to form than Pvt Ltd',
      'Convertible to Pvt Ltd later',
    ],
  },
];

const OnboardingOptions = () => {
  const { completeOnboarding } = useAuth();
  const { toast } = useToast();
  
  const handleSelectOption = async (optionId: string) => {
    try {
      // Save the business structure selection to the database
      await completeOnboarding(optionId);
      
      toast({
        title: "Onboarding completed!",
        description: `You selected ${optionId} as your business structure.`,
      });
    } catch (error) {
      console.error('Error during onboarding:', error);
      toast({
        title: "Error during onboarding",
        description: "Failed to save your business structure selection.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Choose Your Business Structure</h1>
        <p className="text-muted-foreground">
          Select the right business structure for your needs. This will determine your legal obligations, tax requirements, and personal liability.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {onboardingOptions.map((option) => (
          <Card key={option.id} className={`overflow-hidden ${option.recommended ? 'border-primary' : ''}`}>
            {option.recommended && (
              <div className="bg-primary text-primary-foreground text-xs font-medium py-1 text-center">
                RECOMMENDED
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {option.icon}
                </div>
              </div>
              <CardTitle className="mt-4">{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {option.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSelectOption(option.id)}
                variant={option.recommended ? "default" : "outline"}
              >
                Select & Continue
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OnboardingOptions;
