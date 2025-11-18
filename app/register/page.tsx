
"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import { Toast } from "@radix-ui/react-toast";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"




export default function Register() {
    const { user, isSignedIn } = useUser();
    const [mail, setMail] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (!isSignedIn) {
        redirect('/sign-up')
    }else if(isSignedIn && user){
      const uid = user.publicMetadata?.uid;
      console.log("Debugging line to check the UID:", uid);
      setMail(user?.primaryEmailAddress?.emailAddress || null)
      if (uid) {
        // Finish sign-up logic here
        redirect('/dashboard');
      }

    }
    // console.log("url",url);
  }, [isSignedIn, user]);

async function handleSubmit(formData: FormData) {
 setIsSubmitting(true);
        
        try {
            const alumniData = {
                name: formData.get('name') as string,
                yearOfPassingOut: parseInt(formData.get('yearOfPassing') as string),
                regNo: formData.get('regno') as string,
                course: formData.get('course') as string,
                department: formData.get('department') as string,
                address: formData.get('address') as string,
                email: formData.get('email') as string,
                contactNo: formData.get('contact') as string,
                userId: user?.id // Include Clerk user ID
            };

            const response = await fetch('/api/upload-from-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        entry: {
                            alumniData
                        }
                    }
                })
            });

            // if (!response.ok) {
            //     console.error('Error response:', response);
            //     const error = await response.json();
            //     throw new Error(error.error || 'Registration failed');
            // }
            if (response.ok) {
                console.log('Registration successful:');
            
        console.log("Updated user metadata:", user?.publicMetadata);
                // Redirect to dashboard or show success message
                alert('Registration successful!');
                redirect('/dashboard');
            }

        } catch (error) {
            console.error('Error during registration:', error);
            // alert('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }


  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
    <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Alumni Registration
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
                Complete your registration to join our alumni network
            </p>
        </div>
        
    <form className="w-full max-w-4xl mx-auto bg-card p-4 sm:p-6 lg:p-8 rounded-lg shadow-md border" id="registrationForm" action={(formData) => handleSubmit(formData)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="name">
                Name *
                </label>
                <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                />
            </div>

            <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="yearOfPassing">
                Year of Passing *
                </label>
                <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="yearOfPassing"
                name="yearOfPassing"
                type="number"
                placeholder="e.g. 2020"
                min="1950"
                max="2169"
                required
                />
            </div>

            <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="regno">
                Register Number *
                </label>
                <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="regno"
                name="regno"
                type="text"
                placeholder="Enter your registration number"
                required
                />
            </div>

            <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="course">
                Course *
                </label>
                <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="course"
                name="course"
                type="text"
                placeholder="e.g. B.Tech, M.Tech, MBA"
                required
                />
            </div>

            <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="department">
                Department *
                </label>
                <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="department"
                name="department"
                type="text"
                placeholder="e.g. Computer Science, Mechanical"
                required
                />
            </div>

            <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="email">
                E-mail Id *
                </label>
                <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={mail || ""}
                required
                />
            </div>

            <div className="mb-4">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="contact">
                Contact Number *
                </label>
                <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="contact"
                name="contact"
                type="tel"
                placeholder="Enter your contact number"
                pattern="[0-9]{10}"
                required
                />
            </div>

            <div className="mb-6 md:col-span-2">
                <label className="block text-foreground text-sm font-bold mb-2" htmlFor="address">
                Address of Residence *
                </label>
                <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="address"
                name="address"
                rows={3}
                placeholder="Enter your current address"
                required
                />
            </div>
        </div>

        <div className="flex items-center justify-center mt-6">
            <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
            type="submit"
            disabled={isSubmitting}
            >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    </form>
    </div>
    </div>
  );
}