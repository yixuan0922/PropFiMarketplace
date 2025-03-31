import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  price: z.coerce.number().positive("Price must be positive"),
  pricePerSqft: z.coerce.number().positive("Price per sqft must be positive"),
  bedrooms: z.coerce.number().int().positive("Number of bedrooms is required"),
  bathrooms: z.coerce.number().positive("Number of bathrooms is required"),
  squareFeet: z.coerce.number().int().positive("Square footage is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  propertyType: z.enum(["condo", "house", "townhouse", "multi-family"]),
  imageUrl: z.string().optional(),
  availableTokens: z.coerce.number().int().min(1, "Available tokens must be at least 1"),
  minimumInvestment: z.coerce.number().positive("Minimum investment is required"),
  status: z.enum(["active", "pending", "sold"]).default("active"),
});

type FormValues = z.infer<typeof formSchema>;

const AddPropertyPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      price: undefined,
      pricePerSqft: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      squareFeet: undefined,
      description: "",
      propertyType: "house",
      imageUrl: "",
      availableTokens: 100,
      minimumInvestment: 500,
      status: "active",
    },
  });
  
  // Check if user is a developer or admin
  const isAllowed = user?.role === "developer" || user?.role === "admin";
  
  // If not a developer, show restricted access message
  if (!isAllowed) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-neutral-600">
              You don't have permission to add properties. Only property developers and administrators can access this page.
            </p>
            <div className="flex space-x-4">
              <Button asChild>
                <a href="/dashboard">Return to Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Handle form submission
  const addPropertyMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property Added",
        description: "The property has been successfully added to the marketplace",
        variant: "default",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Property",
        description: error.message || "There was an error adding the property",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: FormValues) => {
    addPropertyMutation.mutate(data);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
          <CardDescription>
            Complete the form below to list a new property on the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Details */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium border-b pb-2">Property Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Modern Downtown Condo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the property in detail..." 
                            className="resize-none" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Location */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium border-b pb-2">Location</h3>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="94101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Property Specifications */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium border-b pb-2">Property Specifications</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Property Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="multi-family">Multi-Family</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="squareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Feet</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2" step="0.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Price & Investment */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium border-b pb-2">Price & Investment Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Property Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="750000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pricePerSqft"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Sq Ft ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="625" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="availableTokens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Tokens</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormDescription>
                            Total number of tokens for this property
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="minimumInvestment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Investment ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="500" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum amount required to invest
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Images & Status */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium border-b pb-2">Images & Status</h3>
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/property-image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a URL to the primary property image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <CardFooter className="flex justify-between px-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addPropertyMutation.isPending}
                >
                  {addPropertyMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Property
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPropertyPage;