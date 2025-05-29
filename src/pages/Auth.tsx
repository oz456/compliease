
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
// Helper types
interface URLParams {
  role?: 'professional' | 'client';
  mode?: AuthMode;
}

type UserType = 'professional' | 'client';

type TabValue = UserType; // Same as UserType for consistency
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Logo from '@/components/Logo';

type AuthMode = 'signIn' | 'signUp';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(['professional', 'client']).optional(),
  professionalType: z.enum(['CA', 'CS']).optional(),
});

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [userType, setUserType] = useState<TabValue>('client');
  const { signIn, signUp, user, userProfile, isOnboardingComplete } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const roleParam = searchParams.get('role') as 'professional' | 'client' | undefined;
  const initialRole = roleParam === 'professional' ? 'professional' : 'client';
  const initialRoleValue = initialRole; // Simplified since we now only use client/professional
  
  useEffect(() => {
    // Set the mode based on URL parameter if present
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup') {
      setMode('signUp');
    }
    
    // Set the user type based on URL parameter if present
    const role = searchParams.get('role');
    if (role === 'professional') {
      setUserType('professional');
    } else {
      setUserType('client');
    }
  }, [searchParams]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (userProfile?.role === 'professional') {
        if (isOnboardingComplete) {
          navigate('/professional/dashboard');
        } else {
          navigate('/professional/onboarding');
        }
      } else {
        if (isOnboardingComplete) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    }
  }, [user, userProfile, isOnboardingComplete, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: initialRole,
      professionalType: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { email, password, professionalType } = values;
      const role = userType as UserRole;
      
      console.log(`Attempting ${mode} with role: ${role} ${professionalType ? `and type: ${professionalType}` : ''}`);
      
      if (mode === 'signIn') {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        // Validate that professional type is selected for professional role
        if (userType === 'professional' && !professionalType) {
          toast({
            title: "Professional type required",
            description: "Please select whether you're a CA or CS professional.",
            variant: "destructive",
          });
          return;
        }
        
        await signUp(email, password);
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        });  
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{mode === 'signIn' ? 'Sign In' : 'Create Account'}</CardTitle>
            <CardDescription>
              {mode === 'signIn' 
                ? 'Enter your credentials to access your account' 
                : 'Sign up for a new account to get started'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as TabValue)} className="mb-4">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="professional">CA/CS Professional</TabsTrigger>
              </TabsList>
              <TabsContent value="client">
                <p className="text-sm text-muted-foreground mb-4">
                  Sign {mode === 'signIn' ? 'in to' : 'up for'} your client account to manage your compliance needs
                </p>
              </TabsContent>
              <TabsContent value="professional">
                <p className="text-sm text-muted-foreground mb-4">
                  Sign {mode === 'signIn' ? 'in to' : 'up for'} your professional account to manage your clients' compliance
                </p>
              </TabsContent>
            </Tabs>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {mode === 'signUp' && userType === 'professional' && (
                  <FormField
                    control={form.control}
                    name="professionalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your professional type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CA">Chartered Accountant (CA)</SelectItem>
                            <SelectItem value="CS">Company Secretary (CS)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button type="submit" className="w-full">
                  {mode === 'signIn' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center mt-2">
              {mode === 'signIn' ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={toggleMode} className="p-0 h-auto ml-1">
                {mode === 'signIn' ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center mt-4">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default Auth;
